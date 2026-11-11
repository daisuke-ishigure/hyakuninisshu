extends Node3D
## 競技かるた 3D（karuta-taisen-pro.html の豪華版）。ロボットと 1 対 1 で対戦する。
##
## ルールは karuta-taisen-pro と同じ：
## ・枚数は 12 / 24 / 50 枚（自陣と敵陣に半分ずつ）。24 枚は空札 4 枚、50 枚は空札 10 枚。スマホは 24 枚まで。
## ・読まれた札に触れたら取り。読まれた札と違う陣の札に触れたら、または空札で札に触れたら、お手つき。
##   同じ陣の別の札ならセーフ。払った札が巻き込んだ札も「触れた札」に数える。
## ・敵陣の札を取ったら自陣から 1 枚送る（自分で選ぶ）。お手つきをしたら相手から 1 枚送られる。
##   相手陣の最初の枚数を超えては送れない。送られてきた札は、自陣の好きな場所に置ける。
## ・自陣の札を先になくしたほうが勝ち。
##
## 札の動きは board_physics.gd が計算する（すべる・回る・ぶつかる・飛び散る）。
## 札の画像は res://cards/tori_NNN.png・e_NNN.png、読み上げと効果音はサイトの /sound/（karuta-taisen-pro と同じもの）。
## 勝ったときの finish.m4a は Godot が再生できない形式なので、WAV に変換した res://sfx/finish.wav を使う。

const CardScript := preload("res://scripts/card.gd")
const EffectsScript := preload("res://scripts/effects.gd")
const PhysicsScript := preload("res://scripts/board_physics.gd")
const CARD_SHADER := preload("res://shaders/card.gdshader")
const TATAMI_SHADER := preload("res://shaders/tatami.gdshader")
const TATAMI_TEX := preload("res://textures/tatami.webp")
const FONT_PATH := "res://fonts/ui.ttf"
const FINISH_SFX := preload("res://sfx/finish.wav")
const PLACE_SEC := 8.0          # 送られてきた札を置くまでの時間（過ぎたら今の場所に置く）

const W := 0.053
const H := 0.074
const GAP_X := 0.006            # 札の左右の間
const GAP_Z := 0.008            # 段の間
const CENTER_GAP := 0.03        # 自陣と敵陣の間
const BOOST := 1.7              # 指の速さ → 札の飛ぶ速さ
const MAX_SPEED := 2.8          # 札の最大の速さ（m/秒）。強く払うと画面の外まで飛ぶ
const KIMARIJI_SEC := 0.3       # 決まり字 1 文字の読み上げ時間（karuta-taisen-pro と同じ）

const MODES := { 12: [6, 0], 24: [12, 4], 50: [25, 10] }   # 片陣の枚数、空札の枚数
var CPU := {
	"easy": { "min": 1.2, "max": 2.5, "accuracy": 0.65 },
	"normal": { "min": 0.8, "max": 2.2, "accuracy": 0.75 },
	"hard": { "min": 0.7, "max": 0.9, "accuracy": 0.90 },
}

enum S { MENU, INTRO, PLAY, SEND, PLACE, OVER }

var state := S.MENU
var mode_total := 12
var difficulty := "normal"
var is_mobile := false

var camera: Camera3D
var effects: Node3D
var phys: Node
var reader := AudioStreamPlayer.new()

var poems := {}                 # 番号 → { kimariji, tori }
var board: Array = []           # 盤上の札（取られた札は除く）
var slots := { "mine": [], "enemy": [] }   # 置き場所（Vector3）
var initial := { "mine": 0, "enemy": 0 }
var layout := Vector2i(6, 1)    # 片陣の列・段

var order: Array[int] = []      # 読む順番（空札を含む）
var idx := -1
var target_n := 0               # 読まれている歌
var round_open := false         # まだ誰も取っていない
var round_id := 0
var lock_until := 0             # お手つきのあと、この時刻（ミリ秒）までは触れない

var _swiping := false
var _swipe_cards: Array = []    # この払いで触れた札
var _last_move_ms := 0
var _send_done: Callable        # 送る札を選んだあとの続き
var _return_hold_until := 0
var _placing: Node3D = null     # 置き場所を選んでいる送り札
var _place_drag := false
var _place_grab := Vector2.ZERO
var _place_done := false
var sfx: Array[AudioStreamPlayer] = []

# 画面
var ui_font: Font
var status_label: Label
var count_label: Label
var menu: Control
var end_panel: Control
var end_label: Label
var flash: ColorRect
var mode_buttons := {}
var diff_buttons := {}


func _ready() -> void:
	is_mobile = OS.has_feature("web_android") or OS.has_feature("web_ios") or OS.has_feature("mobile")
	_load_poems()
	_build_room()
	phys = PhysicsScript.new()
	add_child(phys)
	phys.touched.connect(_on_touched)
	phys.settled.connect(_on_settled)
	add_child(reader)
	for i in 3:
		var a := AudioStreamPlayer.new()
		add_child(a)
		sfx.append(a)
	_build_ui()
	effects = EffectsScript.new()
	add_child(effects)
	effects.setup(camera, flash)
	get_viewport().size_changed.connect(_fit_camera)
	get_viewport().size_changed.connect(_layout_ui)
	_layout_ui.call_deferred()

	for a in OS.get_cmdline_user_args():
		if a.begins_with("--auto="):
			_auto_test(a.trim_prefix("--auto="))


func _load_poems() -> void:
	var data = JSON.parse_string(FileAccess.get_file_as_string("res://data/poems.json"))
	for p in data:
		poems[int(p["n"])] = p


# ---------- 部屋 ----------

func _build_room() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.08, 0.07, 0.06)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.95, 0.9, 0.82)
	env.ambient_light_energy = 0.35
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR   # 画像の色をそのまま出す
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-62, 25, 0)
	sun.light_energy = 0.7
	sun.light_color = Color(1.0, 0.95, 0.86)
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 2.0
	add_child(sun)

	var tatami := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(5.4, 5.4)
	tatami.mesh = plane
	var tm := ShaderMaterial.new()
	tm.shader = TATAMI_SHADER
	tm.set_shader_parameter("tatami_tex", TATAMI_TEX)
	tatami.material_override = tm
	add_child(tatami)

	camera = Camera3D.new()
	camera.near = 0.01
	camera.fov = 40
	camera.keep_aspect = Camera3D.KEEP_HEIGHT
	add_child(camera)
	camera.position = Vector3(0, 0.45, 0.06)
	camera.look_at(Vector3.ZERO)


## 盤全体が画面に収まる高さから、手前側に少し傾けて見下ろす
func _fit_camera() -> void:
	var vs := get_viewport().get_visible_rect().size
	var aspect := vs.x / maxf(vs.y, 1.0)
	var hw := layout.x * (W + GAP_X) * 0.5 + 0.012
	var hd := CENTER_GAP * 0.5 + layout.y * (H + GAP_Z) + 0.012
	var tv := tan(deg_to_rad(camera.fov) * 0.5)
	var th := tv * aspect
	# 上の文字（状況表示）のぶん、縦は少し余裕をとる
	var dist := maxf(hd * 1.16 / tv, hw / th) * 1.04
	var tilt := deg_to_rad(8.0)
	camera.position = Vector3(0, dist * cos(tilt), dist * sin(tilt))
	camera.look_at(Vector3(0, 0, 0))
	if effects:
		effects.set_camera_base()


# ---------- 画面（文字・ボタン） ----------

func _build_ui() -> void:
	if ResourceLoader.exists(FONT_PATH):
		ui_font = load(FONT_PATH)
	var theme := Theme.new()
	if ui_font:
		theme.default_font = ui_font
	theme.default_font_size = 22

	var layer := CanvasLayer.new()
	add_child(layer)
	flash = ColorRect.new()
	flash.color = Color(1, 1, 1, 0)
	flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	flash.set_anchors_preset(Control.PRESET_FULL_RECT)
	layer.add_child(flash)

	var root := Control.new()
	root.theme = theme
	root.set_anchors_preset(Control.PRESET_FULL_RECT)
	root.mouse_filter = Control.MOUSE_FILTER_IGNORE
	layer.add_child(root)

	# 上：状況と枚数
	var top := VBoxContainer.new()
	top.set_anchors_preset(Control.PRESET_TOP_WIDE)
	top.offset_top = 8
	top.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root.add_child(top)
	count_label = _label("", 18, Color(1, 1, 1))
	top.add_child(count_label)
	status_label = _label("", 24, Color(1, 0.95, 0.8))
	top.add_child(status_label)

	# メニュー
	menu = _panel(root)
	var mv: VBoxContainer = menu.get_child(0)
	mv.add_child(_label("競技かるた 3D", 34, Color(1, 1, 1)))
	mv.add_child(_label("札の枚数", 20, Color(0.95, 0.88, 0.7)))
	var mrow := HBoxContainer.new()
	mrow.alignment = BoxContainer.ALIGNMENT_CENTER
	mv.add_child(mrow)
	for t in [12, 24, 50]:
		var b := _button("%d枚" % t)
		b.pressed.connect(func() -> void: _select_mode(t))
		mrow.add_child(b)
		mode_buttons[t] = b
	mv.add_child(_label("ロボットの強さ", 20, Color(0.95, 0.88, 0.7)))
	var drow := HBoxContainer.new()
	drow.alignment = BoxContainer.ALIGNMENT_CENTER
	mv.add_child(drow)
	for d in [["easy", "やさしい"], ["normal", "ふつう"], ["hard", "つよい"]]:
		var b := _button(d[1])
		b.pressed.connect(func() -> void: _select_diff(d[0]))
		drow.add_child(b)
		diff_buttons[d[0]] = b
	var go := _button("対戦する")
	go.custom_minimum_size = Vector2(220, 56)
	go.set_meta("min", go.custom_minimum_size)
	go.pressed.connect(_start_game)
	mv.add_child(go)
	_select_mode(12)
	_select_diff("normal")
	_update_mode_buttons()

	# 終わり
	end_panel = _panel(root)
	var ev: VBoxContainer = end_panel.get_child(0)
	end_label = _label("", 34, Color(1, 1, 1))
	ev.add_child(end_label)
	var again := _button("もう一度遊ぶ")
	again.pressed.connect(_start_game)
	ev.add_child(again)
	var back := _button("メニューに戻る")
	back.pressed.connect(func() -> void:
		end_panel.visible = false
		menu.visible = true
		state = S.MENU)
	ev.add_child(back)
	end_panel.visible = false


func _panel(root: Control) -> Control:
	var p := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0.08, 0.06, 0.05, 0.86)
	sb.border_color = Color(0.79, 0.64, 0.29)
	sb.set_border_width_all(3)
	sb.set_corner_radius_all(18)
	sb.set_content_margin_all(26)
	p.add_theme_stylebox_override("panel", sb)
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 14)
	v.set_meta("sep", 14)
	p.add_child(v)
	p.set_meta("sb", sb)
	root.add_child(p)
	p.visibility_changed.connect(_layout_ui)
	return p


func _label(text: String, size: int, color: Color) -> Label:
	var l := Label.new()
	l.text = text
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", size)
	l.set_meta("fs", size)
	l.add_theme_color_override("font_color", color)
	l.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.8))
	l.add_theme_constant_override("outline_size", 6)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return l


func _button(text: String) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = Vector2(110, 48)
	b.set_meta("fs", 22)
	b.set_meta("min", b.custom_minimum_size)
	return b


## 画面の大きさに合わせて文字とボタンを大きくする。
## メニューと結果の枠は、画面の横幅の 9 割・高さの 8 割まで広げる（拡大ではなく文字の大きさを変えるので、ぼやけない）。
## 上の状況表示は、縦画面（スマホ）ほど大きくする。
func _layout_ui() -> void:
	if menu == null or end_panel == null:
		return
	var vs := get_viewport().get_visible_rect().size
	for p in [menu, end_panel]:
		if not p.visible:
			continue
		_scale_ui(p, 1.0)
		p.reset_size()
		var sz: Vector2 = p.get_combined_minimum_size()
		var k := minf(vs.x * 0.9 / sz.x, vs.y * 0.8 / sz.y)
		k = clampf(k, 0.5, 6.0)
		_scale_ui(p, k)
		p.reset_size()
		sz = p.get_combined_minimum_size()
		p.size = sz
		p.position = (vs - sz) * 0.5
	var t := clampf(sqrt(vs.x * vs.y) / sqrt(1280.0 * 720.0), 1.0, 3.0)
	for l in [count_label, status_label]:
		_scale_ui(l, t * 1.15)


func _scale_ui(n: Node, k: float) -> void:
	if n.has_meta("fs"):
		n.add_theme_font_size_override("font_size", int(round(n.get_meta("fs") * k)))
	if n.has_meta("min"):
		n.custom_minimum_size = n.get_meta("min") * k
	if n.has_meta("sep"):
		n.add_theme_constant_override("separation", int(round(n.get_meta("sep") * k)))
	if n.has_meta("sb"):
		var sb: StyleBoxFlat = n.get_meta("sb")
		sb.set_content_margin_all(26.0 * k)
		sb.set_corner_radius_all(int(round(18.0 * k)))
		sb.set_border_width_all(maxi(2, int(round(3.0 * k))))
	if n is Label:
		n.add_theme_constant_override("outline_size", int(round(6.0 * k)))
	for c in n.get_children():
		_scale_ui(c, k)


func _select_mode(t: int) -> void:
	mode_total = t
	for k in mode_buttons:
		mode_buttons[k].modulate = Color(1, 0.85, 0.4) if k == t else Color(1, 1, 1)


func _select_diff(d: String) -> void:
	difficulty = d
	for k in diff_buttons:
		diff_buttons[k].modulate = Color(1, 0.85, 0.4) if k == d else Color(1, 1, 1)


## スマホ（と縦画面）は 24 枚まで
func _update_mode_buttons() -> void:
	var vs := get_viewport().get_visible_rect().size
	var small := is_mobile or vs.y > vs.x
	mode_buttons[50].visible = not small
	if small and mode_total == 50:
		_select_mode(24)


func _set_status(t: String, color := Color(1, 0.95, 0.8)) -> void:
	status_label.text = t
	status_label.add_theme_color_override("font_color", color)


func _update_counts() -> void:
	count_label.text = "自陣 %d枚　・　敵陣 %d枚" % [_count("mine"), _count("enemy")]


# ---------- 盤 ----------

func _start_game() -> void:
	_update_mode_buttons()
	menu.visible = false
	end_panel.visible = false
	for c in get_children():
		if c.has_method("load_e"):
			c.queue_free()
	board.clear()
	phys.cards = board
	round_id += 1
	round_open = false
	reader.stop()

	var per: int = MODES[mode_total][0]
	var empty: int = MODES[mode_total][1]
	var vs := get_viewport().get_visible_rect().size
	var portrait := vs.y > vs.x
	if portrait:
		layout = Vector2i(3, 2) if per <= 6 else Vector2i(4, 3)
	else:
		layout = Vector2i(6, 1) if per <= 6 else (Vector2i(6, 2) if per <= 12 else Vector2i(9, 3))
	_make_slots()
	initial = { "mine": per, "enemy": per }

	var nums: Array[int] = []
	for n in range(1, 101):
		nums.append(n)
	nums.shuffle()
	var on_board := nums.slice(0, per * 2)
	order.assign(nums.slice(0, per * 2 + empty))
	order.shuffle()
	for i in on_board.size():
		var c := _make_card(on_board[i])
		_put(c, "mine" if i < per else "enemy", -1)
	_fit_camera()
	_update_counts()
	for k in ["tap", "miss", "robot", "rain"]:
		_get_audio(k)
	idx = -1
	state = S.INTRO
	_set_status("まもなく読み上げが始まります")
	var rid := round_id
	await get_tree().create_timer(2.0).timeout
	if state == S.INTRO and rid == round_id:
		state = S.PLAY
		_next_round()


func _make_slots() -> void:
	for f in ["mine", "enemy"]:
		slots[f] = []
		var sgn := 1.0 if f == "mine" else -1.0
		var list := []
		for r in layout.y:
			for col in layout.x:
				var x := (col - (layout.x - 1) / 2.0) * (W + GAP_X)
				var z := sgn * (CENTER_GAP * 0.5 + H * 0.5 + r * (H + GAP_Z))
				list.append([r, absf(x), Vector3(x, CardScript.REST_Y, z)])
		# 中央に近い段・中央に近い列から使う
		list.sort_custom(func(a, b): return a[0] < b[0] or (a[0] == b[0] and a[1] < b[1]))
		for e in list:
			slots[f].append(e[2])


func _make_card(n: int) -> Node3D:
	var c := CardScript.new() as Node3D
	var tori: Texture2D = load("res://cards/tori_%03d.png" % n)
	c.setup(n, tori, "res://cards/e_%03d.png" % n, CARD_SHADER)
	add_child(c)
	board.append(c)
	return c


## 札を陣の空いている置き場所に置く（s = -1 なら空いている最初の場所）
func _put(c: Node3D, f: String, s: int) -> void:
	if s < 0:
		s = _free_slot(f, c)
	c.field = f
	c.slot = s
	c.place(slots[f][s], 0.0 if f == "mine" else PI)


## 札が置かれていない置き場所（自由な場所に置かれた札とも重ならないもの）
func _free_slot(f: String, except: Node3D = null) -> int:
	for i in slots[f].size():
		if not _home_taken(slots[f][i], except):
			return i
	return 0


## その場所に、ほかの札の置き場所が重なっているか
func _home_taken(p: Vector3, except: Node3D) -> bool:
	for c in board:
		if c == except or c.field == "":
			continue
		if absf(c.home.x - p.x) < W + 0.002 and absf(c.home.z - p.z) < H + 0.002:
			return true
	return false


func _count(f: String) -> int:
	var n := 0
	for c in board:
		if c.field == f:
			n += 1
	return n


func _card_of(n: int) -> Node3D:
	for c in board:
		if c.number == n:
			return c
	return null


## 札を盤から外す（取られた）
func _remove(c: Node3D) -> void:
	c.field = ""
	board.erase(c)
	if phys.held == c:
		phys.held = null
	_update_counts()


# ---------- 進行 ----------

func _next_round() -> void:
	if state == S.OVER:
		return
	if _check_end():
		return
	idx += 1
	if idx >= order.size():
		_finish(_count("mine") <= _count("enemy"))
		return
	round_id += 1
	target_n = order[idx]
	round_open = true
	CardScript.reset_layers()
	_play_reading(target_n)
	var rid := round_id
	_set_status("%d首目" % (idx + 1))
	if _card_of(target_n) != null:
		_schedule_cpu(rid, _kimariji_delay(target_n))
	else:
		# 空札：誰も取れない。少しして次の歌へ
		await get_tree().create_timer(3.0).timeout
		if rid == round_id and state != S.OVER:
			_set_status("空札でした")
			await get_tree().create_timer(0.8).timeout
			if rid == round_id and round_open:
				round_open = false
				_wait_then_next(0.2)


func _kimariji_delay(n: int) -> float:
	var k: String = poems[n]["kimariji"]
	return maxi(k.length(), 1) * KIMARIJI_SEC


## 札の動きが落ち着いて、送り札も終わってから次の歌へ
func _wait_then_next(delay: float) -> void:
	var rid := round_id
	await get_tree().create_timer(delay).timeout
	while (phys.is_moving() or state == S.SEND or state == S.PLACE or _any_busy()) and state != S.OVER:
		await get_tree().create_timer(0.2).timeout
	if rid == round_id and state != S.OVER:
		reader.stop()
		_next_round()


func _any_busy() -> bool:
	for c in board:
		if c.busy:
			return true
	return false


## 勝負がついたか（自陣をなくしたほうが勝ち）
func _check_end() -> bool:
	if _count("mine") == 0:
		_finish(true)
		return true
	if _count("enemy") == 0:
		_finish(false)
		return true
	return false


func _finish(win: bool) -> void:
	if state == S.OVER:
		return
	state = S.OVER
	round_open = false
	round_id += 1
	reader.stop()
	end_label.text = "あなたの勝ち！" if win else "ロボットの勝ち"
	_set_status("")
	end_panel.visible = true
	if win:
		_play_sfx("finish")
		effects.celebrate_screen()
	else:
		_play_sfx("rain")


# ---------- ロボット ----------

func _schedule_cpu(rid: int, base: float) -> void:
	var s: Dictionary = CPU[difficulty]
	var t: float = base + randf_range(s["min"], s["max"])
	await get_tree().create_timer(t).timeout
	_cpu_act(rid)


func _cpu_act(rid: int) -> void:
	if rid != round_id or not round_open or state == S.OVER:
		return
	if state == S.SEND or state == S.PLACE or _swiping or Time.get_ticks_msec() < _return_hold_until:
		await get_tree().create_timer(0.6).timeout
		_cpu_act(rid)
		return
	var target := _card_of(target_n)
	if target == null:
		return
	if randf() < CPU[difficulty]["accuracy"]:
		_cpu_take(target)
		return
	# 取り違える
	var others := board.filter(func(c): return c != target)
	if others.is_empty():
		_cpu_take(target)
		return
	var wrong: Node3D = others.pick_random()
	_cpu_swipe(wrong, 0.9)
	if wrong.field == target.field:
		_schedule_cpu(rid, 0.5)   # 同じ陣の札：お手つきではない
		return
	_set_status("ロボットのお手つき！", Color(1, 0.75, 0.3))
	_play_sfx("miss")
	if _count("mine") > 0 and _count("enemy") < initial["enemy"]:
		await get_tree().create_timer(0.7).timeout
		if state == S.OVER:
			return
		_ask_send(func() -> void:
			if rid == round_id and round_open:
				_set_status("%d首目" % (idx + 1))
				_schedule_cpu(rid, 0.4))
	else:
		_schedule_cpu(rid, 0.6)


## ロボットの手が札を横へ払う（強さ 0〜1）
func _cpu_swipe(c: Node3D, strength: float) -> void:
	var sx := signf(c.position.x) if absf(c.position.x) > 0.01 else (1.0 if randf() < 0.5 else -1.0)
	var v := Vector2(sx * randf_range(1.5, 2.4), randf_range(-0.5, 0.5)) * strength
	var at := Vector2(randf_range(-0.012, 0.012), randf_range(-0.025, 0.025))
	phys.strike(c, v, at, "cpu")


func _cpu_take(c: Node3D) -> void:
	round_open = false
	var from_mine: bool = c.field == "mine"
	_cpu_swipe(c, 1.0)
	_play_sfx("robot")
	_set_status("ロボットが取りました", Color(0.8, 0.9, 1.0))
	await get_tree().create_timer(0.45).timeout
	_remove(c)
	var tw := create_tween()
	tw.tween_property(c, "scale", Vector3.ONE * 0.01, 0.25)
	tw.tween_callback(c.queue_free)
	if _check_end():
		return
	# 自陣から取られた → ロボットが敵陣から 1 枚送ってくる
	if from_mine and _count("enemy") > 0 and _count("mine") < initial["mine"]:
		await get_tree().create_timer(0.4).timeout
		await _cpu_send()
		if state == S.OVER:
			return
	_wait_then_next(1.0)


## ロボットが敵陣の札を 1 枚、自陣へ送ってくる
func _cpu_send() -> void:
	var list := board.filter(func(c): return c.field == "enemy")
	if list.is_empty():
		return
	var c: Node3D = list.pick_random()
	_set_status("ロボットから札が送られてきました", Color(0.8, 0.9, 1.0))
	await _move_to(c, "mine")
	if not _check_end():
		await _let_place(c)


func _move_to(c: Node3D, f: String) -> void:
	var s := _free_slot(f, c)
	c.field = f
	c.slot = s
	_update_counts()
	await c.send_to(slots[f][s], 0.0 if f == "mine" else PI)


# ---------- プレイヤー ----------

func _input(event: InputEvent) -> void:
	if state == S.PLACE:
		_place_input(event)
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if menu.visible or end_panel.visible:
			return
		if event.pressed:
			_press(event.position)
		else:
			_release()
	elif event is InputEventMouseMotion and _swiping:
		var now := Time.get_ticks_msec()
		phys.finger_move(_floor2(event.position), (now - _last_move_ms) / 1000.0)
		_last_move_ms = now


func _press(pos: Vector2) -> void:
	if state == S.SEND:
		var c := _card_at(pos)
		if c and c.field == "mine":
			_send_picked(c)
		return
	if state != S.PLAY or Time.get_ticks_msec() < lock_until:
		return
	_swiping = true
	_swipe_cards = []
	_last_move_ms = Time.get_ticks_msec()
	phys.finger_down(_floor2(pos), _card_at(pos))


func _release() -> void:
	if not _swiping:
		return
	_swiping = false
	phys.finger_up(BOOST, MAX_SPEED)
	var rid := round_id
	# 払った直後（札がまだ近くにあるうち）に判定する。そのあとの巻き込みで読まれた札に当たれば、取りになる。
	await get_tree().create_timer(0.22).timeout
	_judge(rid)


## 札が触れられた（board_physics から）
func _on_touched(c: Node3D, agent: String) -> void:
	if agent != "player" or state != S.PLAY:
		return
	if not _swipe_cards.has(c):
		_swipe_cards.append(c)
	# 読まれた札に触れたら、その場で取り（ロボットより先）
	if round_open and c.number == target_n and c.field != "":
		round_open = false
		_player_take(c)


func _player_take(c: Node3D) -> void:
	var from_enemy: bool = c.field == "enemy"
	_play_sfx("tap")
	_set_status("取りました！", Color(1, 0.9, 0.4))
	# 札が払われて飛んでいくのを少し見せてから、画面の中央で絵札を見せる
	while _swiping:
		await get_tree().process_frame
	await get_tree().create_timer(0.4).timeout
	_remove(c)
	await effects.reveal_win(c)
	c.queue_free()
	if _check_end():
		return
	if from_enemy and _count("mine") > 0 and _count("enemy") < initial["enemy"]:
		_ask_send(func() -> void: _wait_then_next(0.6))
	elif _count("enemy") == 0:
		_check_end()
	else:
		_wait_then_next(0.6)


## 払いの結果：読まれた札に触れていなければ、お手つきかを調べる
func _judge(rid: int) -> void:
	var touched := _swipe_cards.duplicate()
	_swipe_cards = []
	if touched.is_empty() or rid != round_id or not round_open or state != S.PLAY:
		return
	var target := _card_of(target_n)
	var bads := touched.filter(func(c): return c.field != "" and (target == null or c.field != target.field))
	if bads.is_empty():
		return   # 同じ陣の札に触れただけ（お手つきではない）
	# 雷は画面に見えている札に落とす（遠くへ飛んだ札しかなければ、その札の元の場所へ）
	var bad: Node3D = bads[0]
	var strike_at: Variant = null
	for c in bads:
		if camera.is_position_in_frustum(c.global_position):
			bad = c
			break
	if not camera.is_position_in_frustum(bad.global_position):
		strike_at = bad.home
	lock_until = Time.get_ticks_msec() + 1500
	_return_hold_until = Time.get_ticks_msec() + 900
	_set_status("お手つき！", Color(1, 0.45, 0.4))
	_play_sfx("miss")
	effects.thunder(bad, strike_at)
	var shown_until := Time.get_ticks_msec() + 1500
	var tw := create_tween()
	tw.tween_interval(1.2)
	tw.tween_method(bad.set_dim, 0.75, 0.0, 0.4)
	# 相手から 1 枚送られる
	if _count("enemy") > 0 and _count("mine") < initial["mine"]:
		await get_tree().create_timer(1.0).timeout
		if state != S.OVER:
			await _cpu_send()
	while Time.get_ticks_msec() < shown_until:
		await get_tree().process_frame
	if target != null and rid == round_id and round_open and state == S.PLAY:
		_set_status("%d首目" % (idx + 1))


## 自陣から敵陣へ送る札を選ばせる
func _ask_send(done: Callable) -> void:
	state = S.SEND
	_send_done = done
	_set_status("敵陣に送る札を選んでください", Color(1, 0.85, 0.5))
	for c in board:
		if c.field == "mine":
			c.set_glow(0.45)


func _send_picked(c: Node3D) -> void:
	for x in board:
		x.set_glow(0.0)
	state = S.PLAY
	_set_status("札を送りました")
	await _move_to(c, "enemy")
	if _check_end():
		return
	var d := _send_done
	_send_done = Callable()
	if d.is_valid():
		d.call()


var _tidy_t := 0.0

## 念のため：止まったまま乱れている札が残っていたら戻す（止まった知らせを取りこぼしたとき用）
func _process(delta: float) -> void:
	_tidy_t += delta
	if _tidy_t < 0.6:
		return
	_tidy_t = 0.0
	if _swiping or state == S.PLACE or phys.is_moving() or Time.get_ticks_msec() < _return_hold_until:
		return
	for c in board:
		if c.displaced() and not c.busy:
			c.glide_home()


## 札の動きが止まったら、乱れた札をすっと元の配置に戻す
func _on_settled() -> void:
	var wait := (_return_hold_until - Time.get_ticks_msec()) / 1000.0
	await get_tree().create_timer(maxf(wait, 0.0) + 0.25).timeout
	if phys.is_moving():
		return
	for c in board:
		if c.displaced() and not c.busy and c != _placing:
			c.glide_home()


# ---------- 送られてきた札を置く ----------

## 送られてきた札を、自陣の好きな場所に置かせる（ドラッグして離した場所に置く）。
## 時間内に動かさなければ、今の場所（空いている置き場所）に置く。
func _let_place(c: Node3D) -> void:
	if state == S.OVER or c.field != "mine":
		return
	var prev := state
	state = S.PLACE
	_placing = c
	_place_drag = false
	_place_done = false
	c.set_glow(0.6)
	var left := PLACE_SEC
	while not _place_done and state == S.PLACE:
		if not _place_drag:
			left -= get_process_delta_time()
		_set_status("送られてきた札を好きな場所に置いてください（%d）" % ceili(maxf(left, 0.0)), Color(1, 0.85, 0.5))
		if left <= 0.0 and not _place_drag:
			break
		await get_tree().process_frame
	c.set_glow(0.0)
	_placing = null
	_place_drag = false
	if state == S.PLACE:
		state = prev if prev != S.PLACE else S.PLAY
		_set_status(("%d首目" % (idx + 1)) if round_open else "")


func _place_input(event: InputEvent) -> void:
	var c := _placing
	if c == null:
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			if _card_at(event.position) == c:
				c.stop_tween()
				_place_drag = true
				var p := _floor2(event.position)
				_place_grab = Vector2(c.position.x, c.position.z) - p
				c.raise()
		elif _place_drag:
			_place_drag = false
			var spot := _free_spot(Vector2(c.position.x, c.position.z))
			c.home = Vector3(spot.x, CardScript.REST_Y, spot.y)
			c.home_yaw = 0.0
			c.slot = -1
			c.glide_home(0.18)
			_place_done = true
	elif event is InputEventMouseMotion and _place_drag:
		var p := _floor2(event.position) + _place_grab
		var b := _mine_bounds()
		p.x = clampf(p.x, b.position.x, b.end.x)
		p.y = clampf(p.y, b.position.y, b.end.y)
		c.position = Vector3(p.x, c.layer_y + 0.006, p.y)   # 少し持ち上げて動かす
		c.yaw = 0.0
		c.rotation = Vector3.ZERO


## 自陣の、札の中心を置ける範囲（中央の線より手前で、画面に収まるところ）
func _mine_bounds() -> Rect2:
	# 手前ほどカメラに近く、画面に映る畳の幅が狭いので、画面の下の両端で範囲を決める
	var vs := get_viewport().get_visible_rect().size
	var bl := _floor_point(Vector2(0, vs.y))
	var br := _floor_point(vs)
	var x0 := minf(bl.x, br.x) + W * 0.6
	var x1 := maxf(bl.x, br.x) - W * 0.6
	var z0 := CENTER_GAP * 0.5 + H * 0.5
	var z1 := maxf(bl.z, br.z) - H * 0.6
	return Rect2(x0, z0, maxf(x1 - x0, 0.0), maxf(z1 - z0, 0.0))


## 離した場所に置く。ほかの札と重なるなら、いちばん近い空いた場所へずらす
func _free_spot(p: Vector2) -> Vector2:
	var b := _mine_bounds()
	for r in range(0, 60):
		var rad := r * 0.005
		var steps := maxi(1, r * 6)
		for k in steps:
			var a := TAU * k / steps
			var q := p + Vector2(cos(a), sin(a)) * rad
			if r > 0 and not b.has_point(q):
				continue
			if not _home_taken(Vector3(q.x, 0, q.y), _placing):
				return q
	return p


# ---------- 効果音 ----------

func _play_sfx(sname: String) -> void:
	var s: AudioStream
	if sname == "finish":
		s = FINISH_SFX
	else:
		s = await _get_audio(sname)
	if s == null:
		return
	for a in sfx:
		if not a.playing:
			a.stream = s
			a.play()
			return
	sfx[0].stream = s
	sfx[0].play()


# ---------- 部品 ----------

func _floor_point(screen: Vector2) -> Vector3:
	var o := camera.project_ray_origin(screen)
	var n := camera.project_ray_normal(screen)
	if absf(n.y) < 0.0001:
		return o
	return o + n * (-o.y / n.y)


func _floor2(screen: Vector2) -> Vector2:
	var p := _floor_point(screen)
	return Vector2(p.x, p.z)


## 画面の点の下にある札（重なっていたら上にあるもの）
func _card_at(screen: Vector2) -> Node3D:
	var p := _floor_point(screen)
	var best: Node3D = null
	for c in board:
		var local: Vector3 = Basis(Vector3.UP, c.yaw).inverse() * (p - c.position)
		if absf(local.x) <= W * 0.55 and absf(local.z) <= H * 0.53:
			if best == null or c.position.y > best.position.y:
				best = c
	return best


# ---------- 読み上げ ----------

var _audio_cache := {}

func _play_reading(n: int) -> void:
	reader.stop()
	var s: AudioStream = await _get_audio(str(n))
	if s and n == target_n and state != S.OVER:
		reader.stream = s
		reader.play()
	# 次の歌を先に読み込んでおく
	if idx + 1 < order.size():
		_get_audio(str(order[idx + 1]))


## サイトの /sound/<n>.mp3 を読み込む（読み上げは番号、効果音は tap・miss・robot・rain）
func _get_audio(n: String) -> AudioStream:
	if _audio_cache.has(n):
		return _audio_cache[n]
	var bytes := PackedByteArray()
	if OS.has_feature("web"):
		var origin: String = JavaScriptBridge.eval("location.origin")
		var req := HTTPRequest.new()
		add_child(req)
		req.request("%s/sound/%s.mp3" % [origin, n])
		var res: Array = await req.request_completed
		req.queue_free()
		if res[1] == 200:
			bytes = res[3]
	else:
		var path := ProjectSettings.globalize_path("res://").path_join("../../sound/%s.mp3" % n)
		if FileAccess.file_exists(path):
			bytes = FileAccess.get_file_as_bytes(path)
	if bytes.is_empty():
		return null
	var s := AudioStreamMP3.new()
	s.data = bytes
	_audio_cache[n] = s
	return s


# ---------- 動作確認用 ----------

## --auto=take：読まれた札を、隣の札の方へ払う　--auto=wrong：違う陣の札を払う　--auto=cpu：ロボットに取らせる
## --auto=place：送られてきた札を、自陣の左手前へドラッグして置く
func _auto_test(mode: String) -> void:
	if mode == "place":
		_auto_place()
		return
	for d in CPU:
		CPU[d]["min"] = 0.2 if mode == "cpu" else 99.0
		CPU[d]["max"] = 0.3 if mode == "cpu" else 99.0
	await get_tree().process_frame
	_start_game()
	while state != S.PLAY:
		await get_tree().process_frame
	reader.stop()
	if mode == "cpu":
		return
	await get_tree().create_timer(0.3).timeout
	var target := _card_of(target_n)
	if target == null:
		return
	var card := target
	if mode == "wrong":
		card = board.filter(func(c): return c.field != target.field)[0]
	# 札を押して、横の札の方へ素早く払う
	var from := camera.unproject_position(card.position)
	var side := -1.0 if card.position.x > 0.0 else 1.0
	var to := from + Vector2(side * 420, -40)
	_press(from)
	for i in range(1, 9):
		await get_tree().physics_frame
		var e := InputEventMouseMotion.new()
		e.position = from.lerp(to, i / 8.0)
		_input(e)
	_release()


func _auto_place() -> void:
	for d in CPU:
		CPU[d]["min"] = 99.0
		CPU[d]["max"] = 99.0
	await get_tree().process_frame
	_start_game()
	while state != S.PLAY:
		await get_tree().process_frame
	reader.stop()
	# 自陣を 1 枚空けて、ロボットから札を送ってもらう
	var gone: Node3D = board.filter(func(c): return c.field == "mine")[0]
	_remove(gone)
	gone.queue_free()
	_cpu_send()
	while state != S.PLACE:
		await get_tree().process_frame
	await get_tree().create_timer(0.6).timeout
	var c := _placing
	var from := camera.unproject_position(c.position)
	var vs := get_viewport().get_visible_rect().size
	var to := Vector2(vs.x * 0.12, vs.y * 0.86)
	var e := InputEventMouseButton.new()
	e.button_index = MOUSE_BUTTON_LEFT
	e.pressed = true
	e.position = from
	_input(e)
	for i in range(1, 21):
		await get_tree().process_frame
		var m := InputEventMouseMotion.new()
		m.position = from.lerp(to, i / 20.0)
		_input(m)
	await get_tree().create_timer(0.3).timeout
	var u := InputEventMouseButton.new()
	u.button_index = MOUSE_BUTTON_LEFT
	u.pressed = false
	u.position = to
	_input(u)
