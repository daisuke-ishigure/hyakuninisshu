extends Node3D
## 試作：畳の上に札を並べ、タップした札が浮き上がって裏返り、絵札を見せる。
## 札の画像は res://cards/tori_NNN.png（取り札）と res://cards/e_NNN.png（絵札）。両方そろっている番号だけ並べる。

const CardScript := preload("res://scripts/card.gd")
const CARD_SHADER := preload("res://shaders/card.gdshader")
const TATAMI_SHADER := preload("res://shaders/tatami.gdshader")

var camera: Camera3D


func _ready() -> void:
	_build_room()
	_place_cards()
	# 動作確認用：起動オプション -- --autoflip で、最初の札を自動で裏返す
	if "--autoflip" in OS.get_cmdline_user_args():
		await get_tree().create_timer(0.4).timeout
		var first := get_tree().get_nodes_in_group("cards")[0] as Node3D
		first.reveal(camera, 0.8)


func _build_room() -> void:
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color(0.08, 0.07, 0.06)
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color(0.95, 0.9, 0.82)
	env.ambient_light_energy = 0.3
	env.tonemap_mode = Environment.TONE_MAPPER_ACES
	var we := WorldEnvironment.new()
	we.environment = env
	add_child(we)

	var sun := DirectionalLight3D.new()
	sun.rotation_degrees = Vector3(-58, 25, 0)
	sun.light_energy = 0.85
	sun.light_color = Color(1.0, 0.95, 0.86)
	sun.shadow_enabled = true
	sun.directional_shadow_max_distance = 2.0
	add_child(sun)

	var tatami := MeshInstance3D.new()
	var plane := PlaneMesh.new()
	plane.size = Vector2(0.9, 1.8)
	tatami.mesh = plane
	var tm := ShaderMaterial.new()
	tm.shader = TATAMI_SHADER
	tatami.material_override = tm
	add_child(tatami)

	camera = Camera3D.new()
	camera.fov = 40
	add_child(camera)
	camera.position = Vector3(0, 0.26, 0.25)
	camera.look_at(Vector3(0, 0, 0.02))
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


func _place_cards() -> void:
	var nums: Array[int] = []
	for n in range(1, 101):
		if ResourceLoader.exists(_path("tori", n)) and ResourceLoader.exists(_path("e", n)):
			nums.append(n)
	var gap := 0.068
	for i in nums.size():
		var card := CardScript.new() as Node3D
		card.setup(nums[i], load(_path("tori", nums[i])), load(_path("e", nums[i])), CARD_SHADER)
		card.home = Vector3((i - (nums.size() - 1) / 2.0) * gap, 0.0008, 0.0)
		card.position = card.home
		card.add_to_group("cards")
		card.tapped.connect(_on_card_tapped)
		add_child(card)


func _on_card_tapped(card: Node3D) -> void:
	card.reveal(camera)


func _path(kind: String, n: int) -> String:
	return "res://cards/%s_%03d.png" % [kind, n]
