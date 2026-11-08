extends Node3D
## 1 枚の札。表（上向き）が取り札、裏が絵札。
## fly_to() で払われた方向へ飛び、空中で裏返って絵札を上にして着地する。
## どの札が押されたかは main.gd が画面の位置から判定する。

const W := 0.053        # 横 53mm（1 単位 = 1m）
const H := 0.074        # 縦 74mm
const THICK := 0.0015   # 表と裏の間隔（札の厚み）
const REST_Y := 0.0008  # 畳の上に置いたときの高さ

var number := 0
var showing_e := false  # 絵札が上を向いているか
var busy := false
var home := Vector3.ZERO

var _mats: Array[ShaderMaterial] = []


func setup(n: int, tori: Texture2D, e: Texture2D, shader: Shader) -> void:
	number = n
	_mats.append(_add_face(tori, shader, false))
	_mats.append(_add_face(e, shader, true))


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


## 光らせる量（正解の演出）
func set_glow(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("glow", v)


## 暗くする量（お手つきの演出）
func set_dim(v: float) -> void:
	for m in _mats:
		m.set_shader_parameter("dim", v)


## target まで duration 秒で飛ぶ。最高点 height、flips 回（奇数）裏返り、絵札を上にして着地する。
## 着地したときの絵札は、読みやすい向き（取り札と同じ上下）になるように空中で向きを合わせる。
func fly_to(target: Vector3, duration: float, height: float, flips: int, spin: float) -> void:
	busy = true
	var start := position
	var dir := target - start
	dir.y = 0.0
	if dir.length() < 0.001:
		dir = Vector3(0, 0, -1)
	# 進む方向に向かって前転するように、進行方向と直角な水平軸のまわりで回す
	var axis := Vector3.UP.cross(dir.normalized()).normalized()
	var total := flips * PI
	# 前転だけだと絵札の上下が進む方向によって変わるので、水平の回転（yaw）で補う
	var wanted := Basis(Vector3(0, 0, 1), PI)
	var correction := (wanted * Basis(axis, total).inverse()).get_euler().y
	var yaw := correction + spin

	var tw := create_tween()
	tw.tween_method(func(t: float) -> void:
		var e := 1.0 - pow(1.0 - t, 2.2)   # 横方向は最初が速く、着地に向けて減速する
		var p := start.lerp(target, e)
		p.y = REST_Y + height * 4.0 * t * (1.0 - t)
		position = p
		basis = Basis(Vector3.UP, yaw * t) * Basis(axis, total * t)
	, 0.0, 1.0, duration)
	# 着地して小さく弾む
	tw.tween_property(self, "position:y", REST_Y + height * 0.12, 0.07).set_ease(Tween.EASE_OUT)
	tw.tween_property(self, "position:y", REST_Y, 0.07).set_ease(Tween.EASE_IN)
	await tw.finished
	showing_e = flips % 2 == 1
	busy = false


## 元の位置へ取り札を上にして戻す
func go_home(duration := 0.45) -> void:
	busy = true
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
