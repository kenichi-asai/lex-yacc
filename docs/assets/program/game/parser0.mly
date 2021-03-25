%{
(* 補助的な変数、関数、型などの定義 *)
open Syntax
%}

/* トークンの定義 */    /* 以降、コメントが C 式になることに注意 */
%token <string> HOUKOU ITEM TADOUSHI TANDOKUDOUSHI
                        /* これらには string 型の値が伴うことを示している */
%token IE HEYA HE NI KARA SUSUMU HAIRU DERU WO
%token EOL              /* EOL = End Of Line 入力の終わり */

/* エントリーポイント（開始記号）の定義 */
%start start

/* 非終端記号の型をここで宣言する */
%type <Syntax.t> start

/* 入力の文法：

文　　　  = 方向 方向助詞 "進む"
　　　　  | "家" 方向助詞 "入る"
　　　　  | "家" "から" "出る"
　　　　  | "部屋" "から" "出る"
　　　　  | 目的語 他動詞
　　　　  | 単独動詞
方向　　  = "東" | "西" | "南" | "北"
方向助詞  = "へ" | "に"
目的語　  = アイテム "を"
アイテム  = "鍵" | "ドア" | "サボテン" | "宝"
他動詞　  = "取る" | "置く" | "ノックする" | "開く" | "閉じる"
単独動詞  = "終了する"

出力：Syntax.t 型の値

*/

/* 以下の %% は省略不可。それ以降に文法規則を書く */
%%

start:
| bun EOL
        { $1 }

bun:
| HOUKOU houkoujoshi SUSUMU
        { Idousuru ($1) }
| IE houkoujoshi HAIRU
        { Idousuru ("入") }
| IE KARA DERU
        { Idousuru ("出") }
| HEYA KARA DERU
        { Idousuru ("出") }
| mokutekigo TADOUSHI
        { Tadoushi ($1, $2) }
| TANDOKUDOUSHI
        { Tandokudoushi ($1) }

houkoujoshi:
| HE
        { () (* 何も返す必要がない *) }
| NI
        { () (* 何も返す必要がない *) }

mokutekigo:
| ITEM WO
        { $1 }
