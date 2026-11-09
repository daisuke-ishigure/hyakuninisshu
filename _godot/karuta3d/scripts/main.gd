extends Node3D
## 試作：読み上げを聞いて、正しい札を払う。
## 札を押して指（マウス）を動かして離すと、その方向へ速さに応じた勢いで札が飛ぶ（裏返らない）。
## 正解なら飛んでいった札が画面の中央に現れて裏返り、絵札を見せて消える。間違いなら雷が落ちる（正しい札は教えない）。
## 払う指が触れた札や、飛んだ札が当たった札は巻き込まれて滑り、少しして元の位置へすっと戻る。
## 札の画像は res://cards/tori_NNN.png と res://cards/e_NNN.png、読み上げは res://audio/N.mp3。

const CardScript := preload("res://scripts/card.gd")
const EffectsScript := preload("res://scripts/effects.gd")
const CARD_SHADER := preload("res://shaders/card.gdshader")
const TATAMI_SHADER := preload("res://shaders/tatami.gdshader")
const TATAMI_TEX := preload("res://textures/tatami.webp")
const START_TEX := preload("res://ui/start.png")

const TAP_PIXELS := 12.0        # これより動かさずに離したら「軽く払った」扱い
const FAST_SPEED := 3.0         # 画面の高さ／秒。これ以上の速さで払うと最大の勢い

enum State { START, PLAYING, RESULT }

var camera: Camera3D
var effects: Node3D
var cards: Array[Node3D] = []
var state := State.START
var target: Node3D              # 今読まれている歌の札
var reader := AudioStreamPlayer.new()
var overlay: Control
var flash: ColorRect

var _drag_card: Node3D
var _drag_from := Vector2.ZERO
var _trail: Array = []          # 指の最近の位置 [ミリ秒, 画面座標]。離す直前の速さを測る
var _flying: Node3D             # 払われて飛んでいる札
var _touched := {}              # この払いで指が触れた札（同じ札を何度も弾かない）
var _hit_at := {}               # 札の組ごとに最後にぶつかった時刻（同じ組が続けてぶつからない）

const HIT_HEIGHT := 0.012       # これより低く飛んでいる札だけがほかの札に当たる
const MAX_KNOCK := 0.7          # 巻き込まれた札の最大の速さ（m/秒）


func _ready() -> void:
	_build_room()
	_build_ui()
	_place_cards()
	add_child(reader)
	effects = EffectsScript.new()
	add_child(effects)
	effects.setup(camera, flash)

	# 動作確認用：-- --auto=correct / --auto=wrong で、開始して自動で札を払う
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--auto="):
			_auto_test(a.trim_prefix("--auto="))


# ---------- 部屋・画面 ----------

func _build_room() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.08, 0.07, 0.06)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.95, 0.9, 0.82)
	env.ambient_light_energy = 0.35
	# 画像の色をそのまま出す（ACES などは明るい色を黄色く白飛びさせる）
	env.tonemap_mode = Environment.TONE_MAPPER_LINEAR
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
	plane.size = Vector2(5.4, 5.4)   # 畳を何枚も敷き詰めた床（画面の端まで畳が続く）
	tatami.mesh = plane
	var tm := ShaderMaterial.new()
	tm.shader = TATAMI_SHADER
	tm.set_shader_parameter("tatami_tex", TATAMI_TEX)
	tatami.material_override = tm
	add_child(tatami)

	# 真上に近い角度から見下ろす
	camera = Camera3D.new()
	camera.near = 0.01
	add_child(camera)
	camera.position = Vector3(0, 0.30, 0.045)
	camera.look_at(Vector3.ZERO)
	get_viewport().size_changed.connect(_fit_camera)
	_fit_camera()


## スマホの縦画面では横幅に合わせて映す（そのままだと両端の札が画面の外に出る）
func _fit_camera() -> void:
	var size := get_viewport().get_visible_rect().size
	if size.y > size.x:
		camera.keep_aspect = Camera3D.KEEP_WIDTH
		camera.fov = 52
	else:
		camera.keep_aspect = Camera3D.KEEP_HEIGHT
		camera.fov = 40


func _build_ui() -> void:
	var layer := CanvasLayer.new()
	add_child(layer)

	flash = ColorRect.new()
	flash.color = Color(1, 1, 1, 0)
	flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	flash.set_anchors_preset(Control.PRESET_FULL_RECT)
	layer.add_child(flash)

	overlay = Control.new()
	overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	overlay.mouse_filter = Control.MOUSE_FILTER_STOP
	layer.add_child(overlay)
	var dim := ColorRect.new()
	dim.color = Color(0, 0, 0, 0.35)
	dim.mouse_filter = Control.MOUSE_FILTER_IGNORE
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	overlay.add_child(dim)
	var pic := TextureRect.new()
	pic.texture = START_TEX
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	pic.mouse_filter = Control.MOUSE_FILTER_IGNORE
	pic.anchor_left = 0.12
	pic.anchor_right = 0.88
	pic.anchor_top = 0.3
	pic.anchor_bottom = 0.7
	overlay.add_child(pic)
	overlay.gui_input.connect(func(e: InputEvent) -> void:
		if e is InputEventMouseButton and e.pressed:
			_start())


func _place_cards() -> void:
	var nums: Array[int] = []
	for n in range(1, 101):
		if ResourceLoader.exists(_path("tori", n)) and ResourceLoader.exists(_path("e", n)):
			nums.append(n)
	var gap := 0.068
	for i in nums.size():
		var card := CardScript.new() as Node3D
		card.setup(nums[i], load(_path("tori", nums[i])), load(_path("e", nums[i])), CARD_SHADER)
		card.home = Vector3((i - (nums.size() - 1) / 2.0) * gap, card.REST_Y, 0.0)
		card.position = card.home
		add_child(card)
		cards.append(card)


# ---------- 進行 ----------

func _start() -> void:
	if state != State.START:
		return
	overlay.visible = false
	_next_round()


func _next_round() -> void:
	target = cards.pick_random()
	var audio_path := "res://audio/%d.mp3" % target.number
	if ResourceLoader.exists(audio_path):
		reader.stream = load(audio_path)
		reader.play()
	state = State.PLAYING


## 押した・動かした・離したを自分で処理する。
## （札の当たり判定を Godot に任せると判定が少し遅れ、素早く払うと「離した」が先に届いて払いが無視される）
func _input(event: InputEvent) -> void:
	if state != State.PLAYING:
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_drag_card = _card_at(event.position)
			_drag_from = event.position
			_trail = [[Time.get_ticks_msec(), event.position]]
			_touched = {}
		elif _drag_card:
			var card := _drag_card
			_drag_card = null
			_trail.append([Time.get_ticks_msec(), event.position])
			# 離す直前（0.12 秒）の動きで速さを測る。押してから時間がたっていても、最後にはじけば強く飛ぶ
			var now: int = _trail[-1][0]
			var first: Array = _trail[0]
			for t in _trail:
				if now - t[0] <= 120:
					first = t
					break
			var dt := maxf((now - first[0]) / 1000.0, 0.016)
			var speed: float = (event.position - first[1]).length() / dt   # 画面の点／秒
			_swipe(card, _drag_from, event.position, speed)
	elif event is InputEventMouseMotion and _drag_card:
		_finger_touch(_trail[-1], [Time.get_ticks_msec(), event.position])
		_trail.append([Time.get_ticks_msec(), event.position])
		if _trail.size() > 20:
			_trail.pop_front()


## 払う指がほかの札の上を通ったら、指の動く向きに軽く弾く
func _finger_touch(prev: Array, now: Array) -> void:
	var p := _floor_point(now[1])
	var dt := maxf((now[0] - prev[0]) / 1000.0, 0.008)
	var v := (p - _floor_point(prev[1])) / dt
	v.y = 0.0
	for c in cards:
		if c == _drag_card or c.busy or not c.visible or _touched.has(c):
			continue
		var local: Vector3 = c.global_transform.affine_inverse() * p
		if absf(local.x) <= CardScript.W * 0.5 and absf(local.z) <= CardScript.H * 0.5:
			_touched[c] = true
			var kv := v * 0.35
			if kv.length() > MAX_KNOCK * 0.6:
				kv = kv.normalized() * MAX_KNOCK * 0.6
			if kv.length() > 0.05:
				c.knock(kv, randf_range(-0.6, 0.6))


## 飛んでいる札・滑っている札がほかの札に重なったら、ぶつかった向きに弾き飛ばす
func _physics_process(_delta: float) -> void:
	var movers: Array[Node3D] = []
	if _flying and _flying.position.y < HIT_HEIGHT:
		movers.append(_flying)
	for c in cards:
		if c.sliding:
			movers.append(c)
	var now := Time.get_ticks_msec()
	for m in movers:
		for c in cards:
			if c == m or c == _flying or not c.visible or c.position.y > HIT_HEIGHT:
				continue
			var key := "%d-%d" % [mini(m.get_instance_id(), c.get_instance_id()), maxi(m.get_instance_id(), c.get_instance_id())]
			if now - int(_hit_at.get(key, 0)) < 400:
				continue
			if _overlap(m, c):
				_hit_at[key] = now
				_hit(m, c)


func _hit(mover: Node3D, other: Node3D) -> void:
	var mv: Vector3 = mover.vel
	mv.y = 0.0
	var d := other.position - mover.position
	d.y = 0.0
	var n := d.normalized() if d.length() > 0.001 else mv.normalized()
	# 正面からの勢いを多めに、かすめた分も少し伝える
	var v := n * maxf(mv.dot(n), 0.0) * 0.8 + mv * 0.25
	if v.length() > MAX_KNOCK:
		v = v.normalized() * MAX_KNOCK
	if v.length() < 0.12:
		v = n * 0.12
	# 中心を外れて当たるほど強く回る
	var spin := clampf(mv.cross(n).y * 3.0, -1.6, 1.6) + randf_range(-0.25, 0.25)
	other.knock(v, spin)


## 2 枚の札（畳の上の長方形）が重なっているか（分離軸で判定）
func _overlap(a: Node3D, b: Node3D) -> bool:
	var axes: Array[Vector2] = []
	for n in [a, b]:
		var bs: Basis = n.global_transform.basis
		axes.append(Vector2(bs.x.x, bs.x.z).normalized())
		axes.append(Vector2(bs.z.x, bs.z.z).normalized())
	var d := Vector2(b.position.x - a.position.x, b.position.z - a.position.z)
	for ax in axes:
		var r := 0.0
		for n in [a, b]:
			var bs: Basis = n.global_transform.basis
			r += absf(ax.dot(Vector2(bs.x.x, bs.x.z).normalized())) * CardScript.W * 0.5
			r += absf(ax.dot(Vector2(bs.z.x, bs.z.z).normalized())) * CardScript.H * 0.5
		if absf(ax.dot(d)) >= r:
			return false
	return true


## 画面上の点の下にある札（重なっていたら上にあるもの）
func _card_at(screen: Vector2) -> Node3D:
	var p := _floor_point(screen)
	var best: Node3D = null
	for c in cards:
		if c.busy:
			continue
		var local: Vector3 = c.global_transform.affine_inverse() * p
		if absf(local.x) <= CardScript.W * 0.6 and absf(local.z) <= CardScript.H * 0.58:
			if best == null or c.position.y > best.position.y:
				best = c
	return best


## 払った向き（押した位置→離した位置）と速さ（離す直前の動き、画面の点／秒）から、
## 札の飛ぶ先・高さ・回転を決めて飛ばし、正誤の演出を出す。
## 正解の札は強く払えば画面の外まで飛ぶ。間違いの札は雷が見えるよう画面の中に着地させる。
func _swipe(card: Node3D, from: Vector2, to: Vector2, speed: float) -> void:
	state = State.RESULT
	var move := to - from
	var screen_h := get_viewport().get_visible_rect().size.y
	var power := 0.15   # 動かさずに離したときは軽く払う
	var dir := Vector3(0, 0, -1)
	if move.length() > TAP_PIXELS:
		power = clampf(speed / screen_h / FAST_SPEED, 0.15, 1.0)
		var a := _floor_point(from)
		var b := _floor_point(to)
		dir = Vector3(b.x - a.x, 0, b.z - a.z).normalized()

	var correct := card == target
	var dist := lerpf(0.04, 0.45, power) if correct else lerpf(0.03, 0.2, power)
	var land := card.position + dir * dist
	if not correct:
		land = _clamp_to_view(land)
	land.y = CardScript.REST_Y
	# 札は低く畳をすべるように飛ぶ（周りの札に当たって巻き込む）
	_flying = card
	await card.fly_to(land, lerpf(0.3, 0.5, power), lerpf(0.002, 0.016, power), randf_range(-1.2, 1.2) * power)
	_flying = null

	if correct:
		await effects.reveal_win(card)
	else:
		effects.thunder(card)   # 正しい札の場所は教えない
	await get_tree().create_timer(0.6 if correct else 2.4).timeout

	reader.stop()
	CardScript.reset_layers()
	for c in cards:
		c.layer_y = CardScript.REST_Y
		c.go_home()
	await get_tree().create_timer(0.8).timeout
	_next_round()


## 画面上の点の真下にある畳の上の点
func _floor_point(screen: Vector2) -> Vector3:
	var o := camera.project_ray_origin(screen)
	var n := camera.project_ray_normal(screen)
	if absf(n.y) < 0.0001:
		return o
	return o + n * (-o.y / n.y)


## 札が画面からはみ出さないよう、着地点を見えている範囲に収める
func _clamp_to_view(p: Vector3) -> Vector3:
	var size := get_viewport().get_visible_rect().size
	var tl := _floor_point(Vector2.ZERO)
	var br := _floor_point(size)
	# 札が回って斜めに着地しても収まるよう、札の対角線の半分より少し大きく空ける
	var mx := CardScript.H * 0.62
	var mz := CardScript.H * 0.62
	p.x = clampf(p.x, minf(tl.x, br.x) + mx, maxf(tl.x, br.x) - mx)
	p.z = clampf(p.z, minf(tl.z, br.z) + mz, maxf(tl.z, br.z) - mz)
	p.y = CardScript.REST_Y
	return p


func _path(kind: String, n: int) -> String:
	return "res://cards/%s_%03d.png" % [kind, n]


# ---------- 動作確認用 ----------

func _auto_test(mode: String) -> void:
	await get_tree().process_frame
	_start()
	reader.stop()
	await get_tree().create_timer(0.3).timeout
	if mode == "hit":
		# 左端の札を右へ払い、隣の札を巻き込む
		var c0: Node3D = cards[0]
		var f0 := camera.unproject_position(c0.position)
		_swipe(c0, f0, f0 + Vector2(300, -30), 1400.0)
		return
	var card: Node3D = target if mode == "correct" else cards.filter(func(c): return c != target)[0]
	var from := camera.unproject_position(card.position)
	_swipe(card, from, from + Vector2(140, -260), 2500.0)
