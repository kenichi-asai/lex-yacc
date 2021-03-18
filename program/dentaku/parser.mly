%{
(* 補助的な変数、関数、型などの定義 *)
%}

/* トークンの定義 */    /* 以降、コメントが C 式になることに注意 */
%token LPAREN RPAREN
%token MINUS TIMES
%token <int> NUMBER     /* これは、整数には int 型の値が伴うことを示す */
%token EOF              /* End of File: 入力の終わりを示す */

/* エントリーポイント（開始記号）の定義 */
%start start

/* 非終端記号の型をここで宣言する */
%type <Syntax.t> start

/* 演算子の優先順位を指定する */
/* 下に行くほど強く結合する */
%left MINUS
%left TIMES
%nonassoc UNARY
/* nonassoc は結合なし（毎回、括弧が必要）、left は左結合、right は右結合 */

/* 以下の %% は省略不可。それ以降に文法規則を書く */
%%

start:
| expr EOF               { $1 }

simple_expr:
| NUMBER                 { Syntax.Num ($1) }
| LPAREN expr RPAREN     { $2 }

expr:
| simple_expr            { $1 }
| expr MINUS expr        { Syntax.Op ($1, Syntax.Minus, $3) }
| expr TIMES expr        { Syntax.Op ($1, Syntax.Times, $3) }
| MINUS expr %prec UNARY { Syntax.Op (Syntax.Num (0), Syntax.Minus, $2) }
