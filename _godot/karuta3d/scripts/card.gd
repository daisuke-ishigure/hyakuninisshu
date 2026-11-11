extends Node3D
## 1 枚の札。表（上向き）が取り札、裏が絵札。
## 陣（field）は "mine"（自陣・手前）か "enemy"（敵陣・奥）。敵陣の札は相手から読める向き（180°回転）に置く。
## どの札が押されたかは main.gd が画面の位置から判定する。

const W := 0.053        # 横 53mm（1 単位 = 1m）
const H := 0.074        # 縦 74mm
const THICK := 0.0015   # 表と裏の間隔（札の厚み）
const REST_Y := 0.0008  # 畳の上に置いたときの高さ

var number := 0
var field := ""             # "mine" / "enemy"。取られた札は ""
var slot := -1              # 陣の中の置き場所の番号
var busy := false
var home := Vector3.ZERO    # 置き場所
var home_yaw := 0.0         # 置き場所での向き（敵陣は PI）

static var _top := 0        # 最後に動いた札ほど上に重なるよう、動くたびに増やす
var layer_y := REST_Y       # 今の置き高さ（重なったとき面がちらつかないよう札ごとにずらす）
var vel := Vector3.ZERO     # 今の速さ（m/秒）。ぶつかったときの勢いに使う

# 物理（board_physics.gd が使う）
var yaw := 0.0              # 畳の上での向き（y 軸まわり）。見た目の傾きとは別に持つ
var pv := Vector2.ZERO      # 畳の上の速さ (x, z) m/秒
var pw := 0.0               # 回る速さ rad/秒
var hy := 0.0               # 畳からの浮き
var vy := 0.0               # 上向きの速さ
var dyn := false            # 動いている（止まると false）
var sleep_t := 0.0
var agent := ""             # 誰の動きで動いたか（"player" / "cpu"）
var flutter := 0.0          # 浮いたときの傾きの向きと大きさ

var _mats: Array[ShaderMaterial] = []
var _last := Vector3.ZERO
var _move_tw: Tween
var _e_path := ""           # 絵札の画像（裏返すときに初めて読み込む）
var _shader: Shader


func setup(n: int, tori: Texture2D, e_path: String, shader: Shader) -> void:
	number = n
	_shader = shader
	_e_path = e_path
	_mats.append(_add_face(tori, shader, false))


## 絵札の面を用意する（正解の演出の直前に呼ぶ。全部の札の絵札を最初から読むとスマホのメモリが足りない）
func load_e() -> void:
	if _mats.size() >= 2 or _e_path == "" or not ResourceLoader.exists(_e_path):
		return
	_mats.append(_add_face(load(_e_path), _shader, true))


## 動き出す札を一番上の層にする
func raise() -> void:
	_top = mini(_top + 1, 30)
	layer_y = REST_Y + 0.0004 * _top


## 次の歌の前に層を元に戻す
static func reset_layers() -> void:
	_top = 0


## 置き場所を決めて、そこにすぐ置く
func place(pos: Vector3, y: float) -> void:
	home = pos
	home_yaw = y
	position = pos
	yaw = y
	rotation = Vector3(0, y, 0)


## 置き場所から動いているか
func displaced() -> bool:
	return Vector2(position.x - home.x, position.z - home.z).length() > 0.0015 or absf(wrapf(yaw - home_yaw, -PI, PI)) > 0.02


func stop_tween() -> void:
	if _move_tw and _move_tw.is_valid():
		_move_tw.kill()
	busy = false


## 置き場所へすっと戻る（向きも近いほうへ回して戻す）。遠くまで飛んだ札は少し長めに。
func glide_home(duration := -1.0) -> void:
	stop_tween()
	busy = true
	agent = ""
	dyn = false
	pv = Vector2.ZERO
	pw = 0.0
	hy = 0.0
	vy = 0.0
	var p0 := position
	var y0 := yaw
	var dy := wrapf(home_yaw - y0, -PI, PI)
	if duration < 0.0:
		duration = clampf(Vector2(p0.x - home.x, p0.z - home.z).length() * 1.6, 0.3, 0.75)
	raise()
	_move_tw = create_tween()
	_move_tw.tween_method(func(t: float) -> void:
		var e := t * t * (3.0 - 2.0 * t)
		var p := p0.lerp(home, e)
		p.y = layer_y   # 戻る途中もほかの札の上を通る
		position = p
		yaw = y0 + dy * e
	, 0.0, 1.0, duration)
	_move_tw.tween_callback(func() -> void: busy = false)


## 送り札：新しい置き場所へ、畳の上をすべるように移る
func send_to(pos: Vector3, y: float) -> void:
	home = pos
	home_yaw = y
	glide_home(0.65)
	await _move_tw.finished


func _add_face(tex: Texture2D, shader: Shader, is_back: bool) -> ShaderMaterial:
	var mi := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(W, H)
	mi.mesh = plane
	var m := ShaderMaterial.new()
	m.shader = shader
	m.set_shader_parameter("tex", tex)
	m.set_shader_parameter("aspect", W / H)
	mi.material_override = m
	if is_back:
		# 裏面は下向き。札を半回転させると上に来る。
		mi.rotation = Vector3(0, 0, PI)
		mi.position.y = -THICK * 0.5
	else:
		mi.position.y = THICK * 0.5
	add_child(mi)
	return m


## 影を落とすか（画面の中央に浮かせて見せる間は消す）
func set_shadow(on: bool) -> void:
	for c in get_children():
		if c is MeshInstance3D:
			c.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON if on else GeometryInstance3D.SHADOW_CASTING_SETTING_OFF


## 光らせる量（正解の演出・送る札の選択）
func set_glow(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("glow", v)


## 暗くする量（お手つきの演出）
func set_dim(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("dim", v)
