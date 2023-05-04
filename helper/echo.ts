import { getSilent } from "https://deno.land/x/denops_std@v4.1.6/helper/echo.ts";
import { execute } from "https://deno.land/x/denops_std@v4.1.6/helper/execute.ts";
import type { Denops } from "https://deno.land/x/denops_std@v4.1.6/mod.ts";
import { generateUniqueString } from "https://deno.land/x/denops_std@v4.1.6/util.ts";

// Re-export because version dependent
export {
  getSilent,
  setSilent,
} from "https://deno.land/x/denops_std@v4.1.6/helper/echo.ts";

const cacheKey = "denops_backport/helper/echo@2";

async function ensurePrerequisites(denops: Denops): Promise<string> {
  if (typeof denops.context[cacheKey] === "string") {
    return denops.context[cacheKey];
  }
  const suffix = generateUniqueString();
  denops.context[cacheKey] = suffix;
  const script = `
  function! DenopsBackport_echomsg_${suffix}(message, highlight) abort
    if a:highlight !=# '' | execute 'echohl' a:highlight | endif
    echomsg a:message
    if a:highlight !=# '' | echohl None | endif
  endfunction
  if exists(':echowindow') ==# 2
    function! DenopsBackport_echowindow_${suffix}(message, mods, highlight) abort
      if a:highlight !=# '' | execute 'echohl' a:highlight | endif
      execute a:mods .. 'echowindow a:message'
      if a:highlight !=# '' | echohl None | endif
    endfunction
  else
    function! DenopsBackport_echowindow_${suffix}(message, mods, highlight) abort
      call DenopsBackport_echomsg_${suffix}(a:message, a:highlight)
    endfunction
  endif
  `;
  await execute(denops, script);
  return suffix;
}

/**
 * Echo the expression(s) as a true message, saving the
 * message in the |message-history|.
 * Spaces are placed between the arguments as with the
 * `:echo` command.  But unprintable characters are
 * displayed, not interpreted.
 * The parsing works slightly different from `:echo`,
 * more like `:execute`.  All the expressions are first
 * evaluated and concatenated before echoing anything.
 * If expressions does not evaluate to a Number or
 * String, string() is used to turn it into a string.
 * Uses the highlighting set by the `:echohl` command.
 *
 * ## denops_backport
 *
 * Only one string can be specified.
 * If `opt.highlight` is specified, the highlight gourp is changed with
 * `:echohl` and restored to `None` after execution.
 *
 * @param message Message text
 * @param [opt.highlight] Highlight group name
 */
export async function echomsg(
  denops: Denops,
  message: string,
  opt?: { highlight?: string },
): Promise<void> {
  const silent = getSilent(denops);
  if (silent === "silent!") return;
  const suffix = await ensurePrerequisites(denops);
  const { highlight = "" } = opt ?? {};
  await denops.call(
    `DenopsBackport_echomsg_${suffix}`,
    message,
    highlight,
  );
}

/**
 * Like |:echomsg| but when the messages popup window is
 * available the message is displayed there.  This means
 * it will show for three seconds and avoid a
 * |hit-enter| prompt.  If you want to hide it before
 * that, press Esc in Normal mode (when it would
 * otherwise beep).  If it disappears too soon you can
 * use `:messages` to see the text.
 * When [N] is given then the window will show up for
 * this number of seconds.  The last `:echowindow` with a
 * count matters, it is used once only.
 * The message window is available when Vim was compiled
 * with the +timer and the +popupwin features.
 *
 * ## denops_backport
 *
 * Only one string can be specified.
 * If `:echowindow` not available, `:echomsg` is used.
 * If `opt.highlight` is specified, the highlight gourp is changed with
 * `:echohl` and restored to `None` after execution.
 *
 * @param message Message text
 * @param [opt.seconds] Window show up time
 * @param [opt.highlight] Highlight group name
 */
export async function echowindow(
  denops: Denops,
  message: string,
  opt?: { seconds?: number; highlight?: string },
): Promise<void> {
  const silent = getSilent(denops);
  if (silent === "silent!") return;
  const suffix = await ensurePrerequisites(denops);
  const { seconds: mods = "", highlight = "" } = opt ?? {};
  await denops.call(
    `DenopsBackport_echowindow_${suffix}`,
    message,
    mods,
    highlight,
  );
}
