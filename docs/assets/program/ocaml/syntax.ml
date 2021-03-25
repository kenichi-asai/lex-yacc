(* ２項演算子の型 *)
type op_t = Plus | Minus | Times | Divide | Mod | And | Or |
            Equal | NotEqual | Less | LessEqual

(* ２項演算子を文字列にする関数 *)
(* op_to_string : op_t -> string *)
let op_to_string op = match op with
    Plus -> " + "
  | Minus -> " - "
  | Times -> " * "
  | Divide -> " / "
  | Mod -> " mod "
  | And -> " && "
  | Or -> " || "
  | Equal -> " = "
  | NotEqual -> " <> "
  | Less -> " < "
  | LessEqual -> " <= "

(* Syntax.t : parser が出力する抽象構文木の型 *)
type t = Number of int
       | Op of t * op_t * t
       | Bool of bool
       | If of t * t * t
       | IfThen of t * t
       | Var of string
       | Let of string * t * t
       | Letrec of string * string * t * t
       | Fun of string * t
       | App of t * t
       | Nil
       | Cons of t * t
       | Match of t * t * string * string * t
       | Seq of t * t list
       | Tuple of t * t list

(* プログラムを文字列にする関数 *)
(* Syntax.to_string : Syntax.t -> string *)
let rec to_string exp = match exp with
    Number (n) -> string_of_int n
  | Bool (b) -> if b then "true" else "false"
  | Var (x) -> x
  | Op (arg1, op, arg2) ->
      "(" ^ to_string arg1
          ^ op_to_string op
          ^ to_string arg2 ^ ")"
  | If (p, t, e) ->
      "(if " ^ to_string p ^
      " then " ^ to_string t ^
      " else " ^ to_string e ^ ")"
  | IfThen (p, t) ->
      "(if " ^ to_string p ^
      " then " ^ to_string t ^ ")"
  | Let (x, t1, t2) ->
      "(let " ^ x ^ " = " ^ to_string t1 ^
      " in " ^ to_string t2 ^ ")"
  | Letrec (f, x, t1, t2) ->
      "(let rec " ^ f ^ " " ^ x ^ " = " ^ to_string t1 ^
      " in " ^ to_string t2 ^ ")"
  | Fun (x, t) ->
      "(fun " ^ x ^ " -> " ^ to_string t ^ ")"
  | App (t1, t2) ->
      "(" ^ to_string t1 ^ " " ^ to_string t2 ^ ")"
  | Nil -> "[]"
  | Cons (t1, t2) ->
      "(" ^ to_string t1 ^ " :: " ^ to_string t2 ^ ")"
  | Match (t1, t2, first, rest, t3) ->
      "(match" ^ to_string t1 ^ " with [] -> " ^ to_string t2 ^
      " | " ^ first ^ " :: " ^ rest ^ " -> " ^ to_string t3 ^ ")"
  | Seq (t, ts) ->
      "(" ^ List.fold_left (fun s t -> s ^ "; " ^ to_string t)
                           (to_string t) ts ^ ")"
  | Tuple (t, ts) ->
      "(" ^ List.fold_left (fun s t -> s ^ ", " ^ to_string t)
                           (to_string t) ts ^ ")"

(* プログラムをプリントする関数 *)
(* Syntax.print : Syntax.t -> unit *)
let print exp =
  let str = to_string exp in
  print_string str
