(* ２項演算子の型 *)
type op_t = Minus | Times

(* Syntax.t: parser が出力する抽象構文木の型 *)
type t  = Num of int            (* 整数 *)
        | Op of t * op_t * t    (* ２項演算 *)

(* 抽象構文木を文字列に変換する関数 *)
(* string_of_expr : Syntax.t -> string *)
let rec string_of_expr expr = match expr with
    Num (n) -> string_of_int n
  | Op (arg1, op, arg2) ->
      "(" ^ string_of_expr arg1
          ^ begin match op with
                Minus -> "-"
              | Times -> "*"
            end
          ^ string_of_expr arg2 ^ ")"

(* 抽象構文木を表示する関数 *)
(* Syntax.print : Syntax.t -> unit *)
let print expr =
  let str = string_of_expr expr
  in print_string str
