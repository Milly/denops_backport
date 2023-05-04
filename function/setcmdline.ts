import type { Denops } from "https://deno.land/x/denops_std@v4.1.6/mod.ts";

/**
 * Set the command line to **{str}** and set the cursor position to
 * **{pos}**.
 * If **{pos}** is omitted, the cursor is positioned after the text.
 * Returns 0 when successful, 1 when not editing the command
 * line.
 *
 * Can also be used as a `method`:
 *
 *     GetText()->setcmdline()
 *
 * @deprecated Use `setcmdline()` in *denops_std@v4.0.0*
 */
export async function setcmdline(
  denops: Denops,
  str: string,
  pos?: number,
): Promise<number>;
export function setcmdline(
  denops: Denops,
  ...args: unknown[]
): Promise<unknown> {
  return denops.call("setcmdline", ...args);
}
