open Syntax

(* 扉の状態を表す型 *)
type door_state_t = Locked | Open | Closed

(* ゲームの状態（世界）を表す型 *)
type state_t = {
  mutable place : string;                                (* 現在、いる場所 *)
  mutable items : string list;                           (* 持ち物リスト *)
          place_state : (string * string list ref) list; (* 各場所にある物 *)
  mutable door_state : door_state_t;                     (* ドアの状態 *)
  mutable hp : int;                             (* ヒットポイント（不使用） *)
}

(* 目的：移動コマンドを処理する *)
(* idou : state_t -> string -> chizu_list -> unit *)
let idou state houkou chizu_list =
  if (houkou = "入" || houkou = "出") && state.door_state <> Open then
    print_endline "扉が閉まっています。"
  else try
    let new_place = List.assoc houkou (List.assoc state.place chizu_list) in
    state.place <- new_place
  with Not_found -> print_endline "そこには行かれません。"

(* 以下、動作を処理する関数群 *)

(* 目的：メッセージを表示する *)
(* message : string -> state_t -> unit *)
let message str _state = print_endline str

(* 目的：「取る」を処理する *)
(* toru : string -> state_t -> unit *)
let toru item state =
  let r = List.assoc state.place state.place_state in
  if not (List.mem item !r)
    then print_endline ("ここに" ^ item ^ "はありません。")
  else if List.mem item state.items
    then print_endline ("あなたはすでに" ^ item ^ "を持っている。")
  else (state.items <- item :: state.items;
        r := List.filter (fun i -> i <> item) !r;
        print_endline ("あなたは" ^ item ^ "を手に入れた！"))

(* 目的：「置く」を処理する *)
(* oku : string -> state_t -> unit *)
let oku item state =
  let r = List.assoc state.place state.place_state in
  if not (List.mem item state.items)
    then print_endline ("あなたは" ^ item ^ "を持っていない。")
  else (state.items <- List.filter (fun x -> x <> item) state.items;
        r := item :: !r;
        print_endline ("あなたは" ^ item ^ "を置いた。"))

(* 目的：「開く」を処理する *)
(* hiraku : string -> state_t -> unit *)
let hiraku item state =
  let r = List.assoc state.place state.place_state in
  if not (List.mem item !r)
    then print_endline ("ここに" ^ item ^ "はありません。")
  else match state.door_state with
      Locked -> if List.mem "鍵" state.items
                then (state.door_state <- Open;
                      print_endline ("あなたは扉を開いた。"))
                else print_endline ("扉は施錠されている。")
    | Open   -> print_endline ("扉はすでに開いている。")
    | Closed -> (state.door_state <- Open;
                 print_endline ("あなたは扉を開いた。"))

(* 目的：「閉じる」を処理する *)
(* tojiru : string -> state_t -> unit *)
let tojiru item state =
  let r = List.assoc state.place state.place_state in
  if not (List.mem item !r)
    then print_endline ("ここに" ^ item ^ "はありません。")
  else match state.door_state with
      Locked -> print_endline ("扉はすでに閉まっている。")
    | Open   -> state.door_state <- Closed;
                print_endline ("あなたは扉を閉めた。")
    | Closed -> print_endline ("扉はすでに閉まっている。")

(* 目的：入力文に従って動作を行う *)
(* dispatch : Syntax.t -> state_t -> dousa_list -> chizu_list -> unit *)
let dispatch input state dousa_list chizu_list = match input with
    Idousuru (houkou) -> idou state houkou chizu_list
  | Tadoushi (mokutekigo, tadoushi) ->
      let lst = List.assoc mokutekigo dousa_list in
                (* この目的語に使える動作のリストを得る *)
      (try
         let thunk = List.assoc tadoushi lst in
         thunk state (* 動作を実行 *)
       with Not_found ->
             print_endline (mokutekigo ^ "を" ^
                            tadoushi ^ "ことはできません。"))
  | Tandokudoushi ("終了する") ->
      print_endline "また遊んでね！"; exit 0
  | Tandokudoushi (tandokudoushi) ->
      print_endline (tandokudoushi ^ "ことはできません。")

(* 目的：現在地の情報を表示する *)
(* basho_message : state_t -> unit *)
let basho_message state =
  print_endline ("あなたは" ^ state.place ^ "にいる。");
  print_string "ここには";
  match !(List.assoc state.place state.place_state) with
      [] -> print_endline "何もない。"
    | item :: rest ->
        print_string item;
        List.iter (fun item ->
                     print_string "と";
                     print_string item)
                  rest;
        print_endline "がある。"

(* ゲームのシナリオ *)

(* ゲームの初期状態 *)
let init_state = {
  place = "草原";
  items = [];
  place_state = [
    ("砂漠", ref ["サボテン"; "鍵"]);
    ("草原", ref []);
    ("家の前",   ref ["扉"]);
    ("部屋の中", ref ["宝"]);
  ];
  door_state = Locked;
  hp = 100;
}

(* 地図 *)
let chizu_list = [
  ("砂漠", [("東", "砂漠"); ("西", "砂漠"); ("南", "砂漠"); ("北", "草原")]);
  ("草原", [("南", "砂漠"); ("北", "家の前")]);
  ("家の前", [("入", "部屋の中"); ("南", "草原")]);
  ("部屋の中", [("出", "家の前")]);
]

(* 動作 *)
let dousa_list = [
  ("サボテン", [("取る", message "あいたた！")]);
  ("鍵",       [("取る", toru "鍵");
                ("置く", oku "鍵")]);
  ("扉",       [("開く", hiraku "扉");
                ("閉じる", tojiru "扉");
                ("ノックする", message "家には誰もいない。")]);
  ("宝",       [("取る", toru "宝");
                ("置く", oku "宝")]);
]

(* 目的：ゲームのメインループ *)
(* loop : state_t -> 'a *)
let rec loop state =
  if List.mem "宝" state.items && state.place = "草原"  (* 宝を草原に *)
                                                        (* 持ち帰ったら *)
  then begin
    print_endline "ゲームクリア！";                     (* ゲームクリア *)
    exit 0
  end;
  basho_message state;                                  (* 場所の情報を表示 *)
  print_string "> ";                                    (* プロンプトを表示 *)
  let line = read_line () in                            (* １行読み込み、*)
  begin try
     let input = Parser.start Lexer.token (Lexing.from_string line) in
                                                (* 字句解析・構文解析をし *)
     dispatch input state dousa_list chizu_list         (* 動作を処理する *)
  with Lexer.Error (str) -> print_endline str
     | Syntax.Error (str) -> print_endline str
     | Parsing.Parse_error -> print_endline "えっ？"
     | Not_found -> print_endline "ええっ？"
  end;
  print_newline ();                                     (* 改行して *)
  loop state                                            (* 続行 *)

(* ゲームの開始 *)
let _ =
  print_endline "ようこそ！";
  print_endline "終了するには「終了する」と入力してください。";
  print_endline "はるか北に家が見えます。";
  print_newline ();
  loop init_state
