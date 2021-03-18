%{
(* 補助的な変数、関数、型などの定義 *)
open Syntax
%}

/* 以降、どういうわけかコメントが C 式になることに注意 */
/* トークンの定義 */
%token <int> NUMBER
/* これは、数字には int 型の値が伴うことを示している */
%token PLUS MINUS TIMES DIVIDE MOD
%token TRUE FALSE AND OR
%token EQUAL NOTEQUAL LESS LESSEQUAL GREATER GREATEREQUAL
%token IF THEN ELSE
%token <string> VAR
/* これは、変数には string 型の値が伴うことを示している */
%token LET REC IN FUN ARROW
%token LBRACKET RBRACKET MATCH WITH CONS BAR
%token LPAREN RPAREN COMMA
%token SEMI
%token EOF
/* End of File: 入力の終わりを示す */

/* 非終端記号の型をここで宣言する */
%type <Syntax.t> start

/* 開始記号の定義 */
%start start

/* 演算子の優先順位を指定する */
/* 下に行くほど強く結合する */
%right OR
%right AND
%nonassoc EQUAL NOTEQUAL LESS LESSEQUAL GREATER GREATEREQUAL
%left PLUS MINUS
%left TIMES DIVIDE MOD
%nonassoc UNARY
/* nonassoc は結合なし（毎回、かっこを書かなくてはならない）、
   left は左結合、right は右結合 */

/* 以下の %% は省略不可。それ以降に文法規則を書く */
%%

start:
| expr EOF
        { $1 }

simple_expr:
| NUMBER
        { Number ($1) }
| TRUE
        { Bool (true) }
| FALSE
        { Bool (false) }
| LPAREN expr RPAREN
        { $2 }

expr:
| simple_expr
        { $1 }
| expr PLUS expr
        { Op ($1, Plus, $3) }
| expr MINUS expr
        { Op ($1, Minus, $3) }
| expr TIMES expr
        { Op ($1, Times, $3) }
| expr DIVIDE expr
        { Op ($1, Divide, $3) }
| expr MOD expr
        { Op ($1, Mod, $3) }
| expr AND expr
        { Op ($1, And, $3) }
| expr OR expr
        { Op ($1, Or, $3) }
| expr EQUAL expr
        { Op ($1, Equal, $3) }
| expr NOTEQUAL expr
        { Op ($1, NotEqual, $3) }
| expr LESS expr
        { Op ($1, Less, $3) }
| expr LESSEQUAL expr
        { Op ($1, LessEqual, $3) }
| expr GREATER expr
        { Op ($3, Less, $1) }
| expr GREATEREQUAL expr
        { Op ($3, LessEqual, $1) }
| MINUS expr %prec UNARY
        { Op (Number (0), Minus, $2) }
