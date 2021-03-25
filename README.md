# 最低限の lex/yacc
（OCaml の）lex と yacc の使い方を解説する教科書です。
活用ください。

- https://kenichi-asai.github.io/lex-yacc/

間違い等は issues の方に上げていただければと思います。

## 手元に web page を作る方法

- ruby 2.4.0 以降を手元にインストールする。
（参考：https://jekyllrb.com/docs/installation/ ）
- `gem install --user-install bundler jekyll` で `jekyll`
をインストールする。
- このリポジトリを clone する。
- `cd docs`
- `jekyll build`

これで `_site/index.html` が得られます。
