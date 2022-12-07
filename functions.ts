import type { Denops } from "https://deno.land/x/denops_std@v3.9.1/mod.ts";
import { exists } from "https://deno.land/x/denops_std@v3.9.3/function/common.ts";

let setcmdline_exist: boolean | undefined;

/**
 * Set the command line to {str} and set the cursor position to
 * {pos}.
 * If {pos} is omitted, the cursor is positioned after the text.
 * Returns 0 when successful, 1 when not editing the command
 * line.
 *
 * **Note that the first call is not possible in a batch block.**
 */
export async function setcmdline(
  denops: Denops,
  str: string,
  pos?: number,
): Promise<number> {
  setcmdline_exist ??= await exists(denops, "*setcmdline");
  if (setcmdline_exist === undefined) {
    throw new Error("Can not be called in a batch block.");
  }
  return setcmdline_exist
    ? setcmdline_native(denops, str, pos)
    : setcmdline_fallback(denops, str, pos);
}

function setcmdline_native(
  denops: Denops,
  str: string,
  pos?: number,
): Promise<number>;
function setcmdline_native(
  denops: Denops,
  ...args: unknown[]
): Promise<number> {
  return denops.call("setcmdline", ...args) as Promise<number>;
}

function setcmdline_fallback(
  denops: Denops,
  str: string,
  pos?: number,
): Promise<number> {
  const exprStr =
    `substitute(escape(l:str,'"\\'),'[[:cntrl:]]',"\\<C-V>\\\\0",'g')`;
  const exprCmdlineReplace = (pos !== undefined)
    ? `printf('["%s",setcmdpos(%d)][0]',${exprStr},l:pos)`
    : `printf('"%s"',${exprStr})`;
  const exprKeys = `printf("\\<C-\\>e%s\\<CR>",${exprCmdlineReplace})`;
  const exprFeedkeys = `feedkeys(${exprKeys},'in')`;
  return denops.eval(exprFeedkeys, { str, pos }) as Promise<number>;
}
