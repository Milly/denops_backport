# denops_backport

[![license:MIT](https://img.shields.io/github/license/Milly/denops_backport?style=flat-square)](LICENSE)
[![deno land](http://img.shields.io/badge/available%20on-deno.land/x/denops__backport-lightgrey.svg?logo=deno)](https://deno.land/x/denops_backport)

[Deno][] module for [denops.vim][]. This module is assumed to be used in denops
plugin and the code is assumed to be called in a worker thread for a plugin.
This module calls modern functions not covered by denops_std.

[Deno]: https://deno.land/
[denops.vim]: https://github.com/vim-denops/denops.vim
