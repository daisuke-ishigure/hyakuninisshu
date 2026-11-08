extends Node3D
## 1 枚の札。表（上向き）が取り札、裏が絵札。
## タップされると tapped を出し、reveal() で浮き上がって裏返り、絵札を見せてから畳に戻る。

signal tapped(card)

const W := 0.053        # 横 53mm（1 単位 = 1m）
const H := 0.074        # 縦 74mm
const THICK := 0.0015   # 表と裏の間隔（札の厚み）

var number := 0
var showing_e := false  # 絵札が上を向いているか
var busy := false
var home := Vector3.ZERO

var _front_mat: ShaderMaterial
var _back_mat: ShaderMaterial


func setup(n: int, tori: Texture2D, e: Texture2D, shader: Shader) -> void:
	number = n
	_front_mat = _add_face(tori, shader, false)
	_back_mat = _add_face(e, shader, true)

	# タップの当たり判定（札より少し大きめにして押しやすくする）
	var area := Area3D.new()
	var shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(W * 1.1, 0.01, H * 1.1)
	shape.shape = box
	area.add_child(shape)
	area.input_ray_pickable = true
	area.input_event.connect(_on_input_event)
	add_child(area)


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
		# 裏面は下向き。札を長辺のまわりに半回転させると、正しい向きで上に来る。
		mi.rotation = Vector3(0, 0, PI)
		mi.position.y = -THICK * 0.5
	else:
		mi.position.y = THICK * 0.5
	add_child(mi)
	return m


func _on_input_event(_camera: Node, event: InputEvent, _pos: Vector3, _normal: Vector3, _idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		tapped.emit(self)


## 札が画面の fill 割合を占めるカメラからの距離。
## 横画面は縦の視野角（fov）に札の縦を、縦画面は横の視野角に札の横を合わせる。
func _show_distance(camera: Camera3D, fill: float) -> float:
	var half := tan(deg_to_rad(camera.fov) * 0.5)
	var size := W if camera.keep_aspect == Camera3D.KEEP_WIDTH else H
	return size / (fill * 2.0 * half)


## 浮き上がってカメラの方を向きながら裏返り、絵札をしばらく見せてから畳に戻る。
func reveal(camera: Camera3D, hold := 1.2) -> void:
	if busy:
		return
	busy = true
	var to_e := not showing_e
	var flip := PI if to_e else 0.0

	# 見せる位置：カメラの正面。札が画面の高さ（縦画面では横幅）の約 75% を占める距離に置く
	var show_pos := camera.global_position - camera.global_basis.z * _show_distance(camera, 0.75)
	# カメラの方へ傾ける角度（札の面がカメラに正対する）
	var dir := (camera.global_position - show_pos).normalized()
	var tilt := atan2(dir.z, dir.y)

	var tw := create_tween()
	# 1. 浮き上がりながら裏返る
	tw.set_parallel(true)
	tw.tween_property(self, "position", show_pos, 0.45).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tw.tween_property(self, "rotation:x", tilt, 0.45).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tw.tween_property(self, "rotation:z", flip, 0.55).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_property(self, "rotation:y", rotation.y + 0.15, 0.25).set_trans(Tween.TRANS_SINE)
	tw.chain().tween_property(self, "rotation:y", rotation.y, 0.3).set_trans(Tween.TRANS_SINE)
	# 2. しばらく見せる
	tw.chain().tween_interval(hold)
	# 3. 畳に戻る（最後に小さく弾む）
	tw.chain().set_parallel(true)
	tw.tween_property(self, "position", home + Vector3(0, 0.004, 0), 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_property(self, "rotation:x", 0.0, 0.32).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.chain().tween_property(self, "position", home, 0.08)
	await tw.finished
	showing_e = to_e
	busy = false
