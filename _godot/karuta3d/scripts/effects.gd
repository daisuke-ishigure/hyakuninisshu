extends Node3D
## 正解・お手つきの演出。main.gd から reveal_win() / thunder() を呼ぶ（celebrate() は畳の上で光らせる版）。

const HALO_SHADER := preload("res://shaders/halo.gdshader")
const PETAL_TEX := preload("res://textures/petal.png")
const SPARK_TEX := preload("res://textures/spark.png")

var camera: Camera3D
var flash: ColorRect          # 画面全体を白く光らせる（雷）
var _cam_base := Vector3.ZERO


func setup(cam: Camera3D, flash_rect: ColorRect) -> void:
	camera = cam
	flash = flash_rect
	_cam_base = cam.position


# ---------- 正解：札が光り輝き、金の粒と花びらが舞う ----------

func celebrate(card: Node3D) -> void:
	var at := card.global_position
	# 札を光らせる（強く光ってから、ゆっくり脈打つ）
	var tw := create_tween()
	tw.tween_method(card.set_glow, 0.0, 1.2, 0.15)
	tw.tween_method(card.set_glow, 1.2, 0.45, 0.5)
	for i in 2:
		tw.tween_method(card.set_glow, 0.45, 0.9, 0.4).set_trans(Tween.TRANS_SINE)
		tw.tween_method(card.set_glow, 0.9, 0.45, 0.4).set_trans(Tween.TRANS_SINE)

	# 札の下に広がる光の輪
	var halo := MeshInstance3D.new()
	var q := PlaneMesh.new()
	q.size = Vector2(0.15, 0.15)
	halo.mesh = q
	var hm := ShaderMaterial.new()
	hm.shader = HALO_SHADER
	halo.material_override = hm
	halo.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(halo)
	halo.global_position = at + Vector3(0, 0.0004, 0)
	var th := create_tween()
	th.tween_method(func(v: float) -> void: hm.set_shader_parameter("intensity", v), 0.0, 0.9, 0.12)
	th.tween_method(func(v: float) -> void: hm.set_shader_parameter("intensity", v), 0.9, 0.0, 1.6)
	th.tween_callback(halo.queue_free)

	# 暖かい光で周りを照らす
	_light_flash(at + Vector3(0, 0.04, 0), Color(1.0, 0.85, 0.5), 0.6, 1.0, 0.12)

	# 金の粒（勢いよく広がる）と花びら（ふわりと落ちる）
	_burst(at, 70, Color(1.0, 0.92, 0.6), SPARK_TEX, 0.008, 0.2, 0.5, Vector3(0, -0.3, 0), 1.2, false)
	_burst(at, 36, Color(1, 1, 1), PETAL_TEX, 0.01, 0.1, 0.28, Vector3(0, -0.06, 0), 2.4, true)


# ---------- 正解：飛んでいった札が画面の中央に現れ、裏返って絵札を見せてから消える ----------

const SHOW_FILL := 0.6     # 現れた札が画面の高さ（縦画面では横幅）に占める割合
const SHOW_HOLD := 0.5     # 絵札を見せる時間（秒）

func reveal_win(card: Node3D) -> void:
	card.busy = true
	card.set_shadow(false)
	# カメラの正面に、札の面をカメラに向けて置く（取り札の面が見える）
	var show_pos := camera.global_position - camera.global_basis.z * _show_distance(SHOW_FILL)
	var to_cam := (camera.global_position - show_pos).normalized()
	var tilt := atan2(to_cam.z, to_cam.y)
	card.position = show_pos
	card.rotation = Vector3(tilt, 0, 0)
	card.scale = Vector3.ONE * 0.05
	card.visible = true
	card.reset_motion()

	var tw := create_tween()
	# 1. ぱっと現れる（少し大きくなりすぎてから戻る）
	tw.tween_property(card, "scale", Vector3.ONE, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_method(card.set_glow, 0.0, 0.6, 0.22)
	# 2. その場で裏返る
	tw.tween_property(card, "rotation:z", PI, 0.4).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN_OUT)
	tw.parallel().tween_method(card.set_glow, 0.6, 1.1, 0.4)
	tw.tween_callback(func() -> void:
		var at := card.global_position + to_cam * 0.01
		_burst(at, 60, Color(1.0, 0.92, 0.6), SPARK_TEX, 0.004, 0.08, 0.2, Vector3.ZERO, 0.9, false)
		_burst(at, 24, Color(1, 1, 1), PETAL_TEX, 0.005, 0.04, 0.1, Vector3(0, 0, 0.02), 1.4, true))
	# 3. 絵札を見せる
	tw.tween_method(card.set_glow, 1.1, 0.35, SHOW_HOLD)
	# 4. 光りながら小さくなって消える
	tw.tween_property(card, "scale", Vector3.ONE * 0.02, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	tw.parallel().tween_method(card.set_glow, 0.35, 1.5, 0.2)
	tw.tween_callback(func() -> void:
		_burst(card.global_position, 40, Color(1.0, 0.95, 0.75), SPARK_TEX, 0.003, 0.06, 0.16, Vector3.ZERO, 0.7, false)
		card.visible = false
		card.scale = Vector3.ONE
		card.set_shadow(true))
	await tw.finished
	card.busy = false


## 札（縦 H、横 W）が画面の fill 割合を占めるカメラからの距離。
## 横画面は縦の視野角に札の縦を、縦画面は横の視野角に札の横を合わせる。
func _show_distance(fill: float) -> float:
	var half := tan(deg_to_rad(camera.fov) * 0.5)
	var size := 0.053 if camera.keep_aspect == Camera3D.KEEP_WIDTH else 0.074
	return size / (fill * 2.0 * half)


# ---------- お手つき：雷が札に落ちる ----------

func thunder(card: Node3D) -> void:
	var at := card.global_position
	# 稲妻：画面の中央寄りの上空から、斜めにジグザグに札へ落ちる
	# （真上から見下ろしているので、真上から落とすと点にしか見えない）
	var side := -signf(at.x) if absf(at.x) > 0.02 else (1.0 if randf() < 0.5 else -1.0)
	var top := at + Vector3(side * 0.11, 0.12, 0.06 if at.z < 0.0 else -0.06)
	var bolt := _make_bolt(top, at, 14, 0.02)
	var branch := _make_bolt(top.lerp(at, 0.4), top.lerp(at, 0.4) + Vector3(randf_range(-0.06, 0.06), -0.07, 0.04), 6, 0.01)
	add_child(bolt)
	add_child(branch)

	# 点滅：一瞬暗くなってから、光る→消える→もう一度光る→消える
	var tw := create_tween()
	tw.tween_interval(0.08)
	for step in [[true, 0.06], [false, 0.05], [true, 0.09], [false, 0.0]]:
		tw.tween_callback(func() -> void:
			bolt.visible = step[0]
			branch.visible = step[0])
		if step[1] > 0.0:
			tw.tween_interval(step[1])
	tw.tween_callback(bolt.queue_free)
	tw.tween_callback(branch.queue_free)

	# 画面が白く光り、カメラが揺れる
	if flash:
		flash.color = Color(0.03, 0.04, 0.12, 0.0)
		var tf := create_tween()
		tf.tween_property(flash, "color:a", 0.5, 0.07)
		tf.tween_callback(func() -> void: flash.color = Color(0.85, 0.9, 1.0, 0.0))
		tf.tween_property(flash, "color:a", 0.4, 0.03)
		tf.tween_property(flash, "color:a", 0.0, 0.08)
		tf.tween_interval(0.05)
		tf.tween_property(flash, "color:a", 0.3, 0.03)
		tf.tween_property(flash, "color:a", 0.0, 0.3)
	_shake(0.35, 0.006)
	_light_flash(at + Vector3(0, 0.03, 0), Color(0.7, 0.8, 1.0), 0.35, 0.3, 0.08)

	# 札は焦げたように暗くなり、小刻みに震える
	var td := create_tween()
	td.tween_method(card.set_dim, 0.0, 0.75, 0.1)
	var base := card.position
	var ts := create_tween()
	for i in 8:
		ts.tween_property(card, "position", base + Vector3(randf_range(-0.002, 0.002), 0, randf_range(-0.002, 0.002)), 0.03)
	ts.tween_property(card, "position", base, 0.03)

	# 青白い火花
	_burst(at, 50, Color(0.7, 0.82, 1.0), SPARK_TEX, 0.006, 0.2, 0.5, Vector3(0, -0.6, 0), 0.6, false)


# ---------- 部品 ----------

## ジグザグの稲妻。点を少しずつずらしながら細い棒をつないで作る。
func _make_bolt(from: Vector3, to: Vector3, segments: int, jitter: float) -> Node3D:
	var root := Node3D.new()
	var mat := StandardMaterial3D.new()
	mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	mat.albedo_color = Color(0.92, 0.95, 1.0)
	mat.emission_enabled = true
	mat.emission = Color(0.6, 0.75, 1.0)
	mat.emission_energy_multiplier = 3.0
	var glow_mat := StandardMaterial3D.new()
	glow_mat.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	glow_mat.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	glow_mat.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	glow_mat.albedo_color = Color(0.4, 0.55, 1.0, 0.35)

	var pts: Array[Vector3] = [from]
	for i in range(1, segments):
		var t := float(i) / segments
		var p := from.lerp(to, t)
		p += Vector3(randf_range(-jitter, jitter), 0, randf_range(-jitter, jitter)) * (1.0 - t * 0.6)
		pts.append(p)
	pts.append(to)
	for i in pts.size() - 1:
		root.add_child(_segment(pts[i], pts[i + 1], 0.0025, mat))
		root.add_child(_segment(pts[i], pts[i + 1], 0.0055, glow_mat))
	root.visible = false
	return root


func _segment(a: Vector3, b: Vector3, thick: float, mat: Material) -> MeshInstance3D:
	var mi := MeshInstance3D.new()
	var box := BoxMesh.new()
	var length := a.distance_to(b)
	box.size = Vector3(thick, thick, length)
	mi.mesh = box
	mi.material_override = mat
	mi.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF   # 光なので影を落とさない
	mi.position = (a + b) * 0.5
	var up := Vector3.UP if absf((b - a).normalized().y) < 0.99 else Vector3.RIGHT
	mi.look_at_from_position(mi.position, b, up)
	return mi


## 粒をいっせいに放つ。petals=true なら大きめでくるくる回りながらゆっくり落ちる。
func _burst(at: Vector3, amount: int, color: Color, tex: Texture2D, size: float, speed_min: float, speed_max: float,
		gravity: Vector3, life: float, petals: bool) -> void:
	var p := CPUParticles3D.new()
	p.amount = amount
	p.one_shot = true
	p.explosiveness = 0.95
	p.lifetime = life
	p.direction = Vector3.UP
	p.spread = 70.0 if petals else 85.0
	p.initial_velocity_min = speed_min
	p.initial_velocity_max = speed_max
	p.gravity = gravity
	p.damping_min = 0.2 if petals else 0.05
	p.damping_max = 0.4 if petals else 0.15
	p.scale_amount_min = 0.6
	p.scale_amount_max = 1.4
	p.angle_min = 0.0
	p.angle_max = 360.0
	if petals:
		p.angular_velocity_min = -240.0
		p.angular_velocity_max = 240.0
	var ramp := Gradient.new()
	ramp.set_color(0, Color(color, 1.0))
	ramp.set_color(1, Color(color, 0.0))
	p.color_ramp = ramp
	var quad := QuadMesh.new()
	quad.size = Vector2(size, size)
	var m := StandardMaterial3D.new()
	m.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
	m.vertex_color_use_as_albedo = true
	m.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	m.billboard_mode = BaseMaterial3D.BILLBOARD_PARTICLES
	m.albedo_texture = tex
	if not petals:
		m.blend_mode = BaseMaterial3D.BLEND_MODE_ADD
	quad.material = m
	p.mesh = quad
	p.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_OFF
	add_child(p)
	p.global_position = at + Vector3(0, 0.003, 0)
	p.emitting = true
	get_tree().create_timer(life + 0.5).timeout.connect(p.queue_free)


func _light_flash(at: Vector3, color: Color, energy: float, duration: float, light_range: float) -> void:
	var l := OmniLight3D.new()
	l.light_color = color
	l.omni_range = light_range
	l.light_energy = energy
	add_child(l)
	l.global_position = at
	var tw := create_tween()
	tw.tween_property(l, "light_energy", 0.0, duration).set_ease(Tween.EASE_IN)
	tw.tween_callback(l.queue_free)


func _shake(duration: float, amount: float) -> void:
	var tw := create_tween()
	var steps := int(duration / 0.03)
	for i in steps:
		var k := 1.0 - float(i) / steps
		tw.tween_property(camera, "position", _cam_base + Vector3(randf_range(-1, 1), 0, randf_range(-1, 1)) * amount * k, 0.03)
	tw.tween_property(camera, "position", _cam_base, 0.03)
