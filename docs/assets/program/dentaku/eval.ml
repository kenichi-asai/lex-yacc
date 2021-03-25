open Syntax

(* 実際の計算をする関数 *)
(* Eval.f : Syntax.t -> int *)
let rec f expr = match expr with
    Num (n) -> n
  | Op (arg1, op, arg2) ->
      let v1 = f arg1 in
      let v2 = f arg2 in
      begin match op with
          Minus -> v1 - v2
        | Times -> v1 * v2
      end
