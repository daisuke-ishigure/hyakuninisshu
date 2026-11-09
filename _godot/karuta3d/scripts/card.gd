extends Node3D
## 1 枚の札。表（上向き）が取り札、裏が絵札。
## fly_to() で払われた方向へ（裏返らずに）飛ぶ。正解の札は effects.gd が画面の中央で裏返して見せる。
## どの札が押されたかは main.gd が画面の位置から判定する。

const W := 0.053        # 横 53mm（1 単位 = 1m）
const H := 0.074        # 縦 74mm
const THICK := 0.0015   # 表と裏の間隔（札の厚み）
const REST_Y := 0.0008  # 畳の上に置いたときの高さ

var number := 0
var showing_e := false  # 絵札が上を向いているか
var busy := false
var home := Vector3.ZERO

static var _top := 0        # 最後に動いた札ほど上に重なるよう、動くたびに増やす
var layer_y := REST_Y       # 今の置き高さ（重なったとき面がちらつかないよう札ごとにずらす）
var vel := Vector3.ZERO     # 今の速さ（m/秒）。ぶつかったときの勢いに使う
var sliding := false        # 巻き込まれて滑っている間 true（ほかの札をさらに巻き込む）

var _mats: Array[ShaderMaterial] = []
var _last := Vector3.ZERO
var _move_tw: Tween


func setup(n: int, tori: Texture2D, e: Texture2D, shader: Shader) -> void:
	number = n
	_mats.append(_add_face(tori, shader, false))
	_mats.append(_add_face(e, shader, true))


func _process(delta: float) -> void:
	if delta > 0.0:
		vel = (position - _last) / delta
	_last = position


## 瞬間移動したあとに呼ぶ（移動した距離を速さとみなして、周りの札を弾かないように）
## 動き出す札を一番上の層にする
func raise() -> void:
	_top = mini(_top + 1, 30)
	layer_y = REST_Y + 0.0004 * _top


## 次の歌の前に層を元に戻す
static func reset_layers() -> void:
	_top = 0


func reset_motion() -> void:
	_last = position
	vel = Vector3.ZERO


## 飛んできた札や指に当たって滑る。摩擦で止まったら、少し間をおいて元の位置へすっと戻る。
func knock(v: Vector3, spin: float) -> void:
	if _move_tw:
		_move_tw.kill()
	busy = true
	sliding = true
	raise()
	var p0 := position
	var slide := Vector3(v.x, 0, v.z) * 0.09   # 滑る距離（速さに比例）
	var y0 := rotation.y
	var t_slide := clampf(slide.length() * 6.0, 0.18, 0.45)
	_move_tw = create_tween()
	_move_tw.tween_method(func(t: float) -> void:
		var e := 1.0 - pow(1.0 - t, 3.0)   # はじめ速く、摩擦で止まる
		position = Vector3(p0.x + slide.x * e, layer_y, p0.z + slide.z * e)
		rotation = Vector3(0, y0 + spin * e, 0)
	, 0.0, 1.0, t_slide)
	_move_tw.tween_callback(func() -> void: sliding = false)
	_move_tw.tween_interval(0.35)
	_move_tw.tween_callback(_glide_home)


func _glide_home() -> void:
	var p0 := position
	var y0 := rotation.y
	var dy := wrapf(-y0, -PI, PI)   # 近い向きへ回して戻す
	_move_tw = create_tween()
	_move_tw.tween_method(func(t: float) -> void:
		var e := t * t * (3.0 - 2.0 * t)
		var p := p0.lerp(home, e)
		p.y = layer_y   # 戻る途中もほかの札の上を通る
		position = p
		rotation = Vector3(0, y0 + dy * e, 0)
	, 0.0, 1.0, 0.4)
	_move_tw.tween_callback(func() -> void: busy = false)


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


## 光らせる量（正解の演出）
func set_glow(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("glow", v)


## 暗くする量（お手つきの演出）
func set_dim(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("dim", v)


## 払われた札が、裏返らずに target まで duration 秒で飛ぶ。最高点 height、飛びながら spin だけ水平に回る。
## target が画面の外なら、そのまま画面の外へ飛んでいく。
func fly_to(target: Vector3, duration: float, height: float, spin: float) -> void:
	busy = true
	raise()
	target.y = layer_y
	var start := position
	var yaw0 := rotation.y
	var tw := create_tween()
	tw.tween_method(func(t: float) -> void:
		var e := 1.0 - pow(1.0 - t, 2.2)   # 最初が速く、だんだん減速する
		var p := start.lerp(target, e)
		p.y = lerpf(start.y, layer_y, e) + height * 4.0 * t * (1.0 - t)
		position = p
		rotation = Vector3(0, yaw0 + spin * e, 0)
	, 0.0, 1.0, duration)
	await tw.finished
	busy = false


## 元の位置へ取り札を上にして戻す。消えていた札（正解の演出のあと）は、元の位置にふわっと現れる。
func go_home(duration := 0.45) -> void:
	if _move_tw:
		_move_tw.kill()
	sliding = false
	busy = true
	if not visible:
		position = home
		reset_motion()
		basis = Basis.IDENTITY
		scale = Vector3.ONE * 0.01
		visible = true
		set_glow(0.0)
		var ta := create_tween()
		ta.tween_property(self, "scale", Vector3.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		await ta.finished
		showing_e = false
		busy = false
		return
	var q0 := basis.get_rotation_quaternion()
	var p0 := position
	var tw := create_tween()
	tw.tween_method(func(t: float) -> void:
		var e := t * t * (3.0 - 2.0 * t)
		var p := p0.lerp(home, e)
		p.y = lerpf(p0.y, home.y, e) + 0.03 * sin(PI * t)
		position = p
		basis = Basis(q0.slerp(Quaternion.IDENTITY, e))
	, 0.0, 1.0, duration)
	await tw.finished
	set_glow(0.0)
	set_dim(0.0)
	showing_e = false
	busy = false
