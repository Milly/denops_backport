import { execute } from "https://deno.land/x/denops_std@v4.1.6/helper/execute.ts";
import type { Denops } from "https://deno.land/x/denops_std@v4.1.6/mod.ts";
import { generateUniqueString } from "https://deno.land/x/denops_std@v4.1.6/util.ts";

const cacheKey = "denops_backport/function/setcmdline@2";

async function ensurePrerequisites(denops: Denops): Promise<string> {
  if (typeof denops.context[cacheKey] === "string") {
    return denops.context[cacheKey];
  }
  const suffix = generateUniqueString();
  denops.context[cacheKey] = suffix;
  const script = `
  if exists('*setcmdline') ==# 1
    function! DenopsBackport_setcmdline_${suffix}(...) abort
      return call('setcmdline', a:000)
    endfunction
  else
    function! DenopsBackport_setcmdline_${suffix}(str, ...) abort
      if getcmdtype() ==# '' | return 1 | endif
      let s = escape(a:str, '"\\')->substitute('[[:cntrl:]]', "\\<C-V>\\\\0", 'g')
      if a:0 >= 1
        let s = printf('["%s",setcmdpos(%d)][0]', s, a:1)
      else
        let s = printf('"%s"', s)
      endif
      call printf("\\<C-\\>e%s\\<CR>", s)->feedkeys('in')
      return 0
    endfunction
  endif
  `;
  await execute(denops, script);
  return suffix;
}

/**
 * Set the command line to {str} and set the cursor position to
 * {pos}.
 * If {pos} is omitted, the cursor is positioned after the text.
 * Returns 0 when successful, 1 when not editing the command
 * line.
 */
export async function setcmdline(
  denops: Denops,
  str: string,
  pos?: number,
): Promise<number> {
  const suffix = await ensurePrerequisites(denops);
  return denops.call(
    `DenopsBackport_setcmdline_${suffix}`,
    str,
    ...(typeof pos === "number" ? [pos] : []),
  ) as Promise<number>;
}
