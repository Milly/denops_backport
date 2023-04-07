# denops_backport

[![license][license-badge]][license] [![deno land][deno-badge]][deno]

[Deno](https://deno.land/) module for [denops.vim][denops]. This module is
assumed to be used in denops plugin and the code is assumed to be called in a
worker thread for a plugin. This module calls modern functions not covered by
denops_std.

[denops]: https://github.com/vim-denops/denops.vim
[license]: https://github.com/Milly/denops_backport/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/Milly/denops_backport?style=flat-square
[deno]: https://deno.land/x/denops_backport
[deno-badge]: http://img.shields.io/badge/deno.land-x/denops__backport-lightgrey.svg?logo=deno
