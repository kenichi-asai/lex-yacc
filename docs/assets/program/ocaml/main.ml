(* メイン関数 *)
let go () =
  let program = Parser.start Lexer.token (Lexing.from_channel stdin) in
  (* これで標準入力を字句解析して、構文解析した結果を program に入れ *)
  Syntax.print program; (* それを表示する *)
  print_newline ()

(* スタートアップ *)
let _ = go ()
