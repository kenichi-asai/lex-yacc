{
(* 補助的な変数、関数、型などの定義 *)
open Parser

(* 字句解析中のエラー *)
exception Error of string
}

(* 正規表現の略記 *)
(* [...] の中は character '...' でなくてはならない *)
let zenkaku1 = ['\224'-'\239']
              (* 0xE0 - 0xEF, UTF-8 の３バイト文字の１文字目 *)
let zenkaku = zenkaku1 _ _

(* 字句解析の規則 *)
rule token = parse
| "東" | "ひがし"                      { HOUKOU ("東") }
| "西" | "にし"                        { HOUKOU ("西") }
| "南" | "みなみ"                      { HOUKOU ("南") }
| "北" | "きた"                        { HOUKOU ("北") }
| "家" | "いえ"                        { IE }
| "部屋" | "へや"                      { HEYA }
| "へ"                                 { HE }
| "に"                                 { NI }
| "から"                               { KARA }
| "進む" | "すすむ" | "行く" | "いく"  { SUSUMU }
| "入る" | "はいる"                    { HAIRU }
| "出る" | "でる"                      { DERU }
| "を"                                 { WO }
| "鍵" | "かぎ"                        { ITEM ("鍵") }
| "ドア" | "扉" | "とびら"             { ITEM ("扉") }
| "サボテン"                           { ITEM ("サボテン") }
| "宝" | "たから"                      { ITEM ("宝") }
| "取る" | "とる"                      { TADOUSHI ("取る") }
| "置く" | "おく"                      { TADOUSHI ("置く") }
| "開く" | "ひらく"                    { TADOUSHI ("開く") }
| "閉じる" | "とじる"                  { TADOUSHI ("閉じる") }
| "ノックする"                         { TADOUSHI ("ノックする") }
| "終了する" | "しゅうりょうする"      { TANDOKUDOUSHI ("終了する") }
| eof                                  { EOL }
| _
        { (* 字句解析できなかった部分をエラーとして例外を起こす *)
          let input = Bytes.to_string lexbuf.Lexing.lex_buffer in (* 入力全体 *)
          let pos = Lexing.lexeme_start lexbuf in (* マッチした先頭の位置 *)
          let str = String.sub input pos (String.length input - pos) in
          raise (Error ("「" ^ str ^ "」？")) }
