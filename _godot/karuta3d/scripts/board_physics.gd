extends Node
## 畳の上の札の物理。札を厚みのない長方形として、すべり・回転・ぶつかり・小さな浮き上がりを計算する。
## Godot の物理エンジンは 5cm の薄い札だと不安定なので、畳の面の上の動きを自前で解く。
##
## ・指（finger）：押した札は指について動き（held）、離すと勢いのまま飛ぶ。指が通った札は指の向きに払われる。
## ・ぶつかり：長方形どうしの重なりを分離軸で調べ、当たった点で撃力を与える（中心を外れると回る）。
## ・強く当たった札は少し浮いて飛び散る。浮いている札は、ほかの札の上を飛び越える。
## ・誰の動きで動いたか（agent："player" / "cpu"）を、ぶつかった札へ受け渡す。お手つきの判定に使う。

signal touched(card, agent)   # 札が初めてその agent の動きで触れられた
signal settled                 # 動いている札がすべて止まった

const W := 0.053
const H := 0.074
const G := 9.8
const MU_FLOOR := 0.55         # 畳との摩擦（減速 = μg）
const ANG_FRICTION := 26.0     # 回転の減速（rad/s²）
const RESTITUTION := 0.28      # 札どうしの跳ね返り
const MU_CARD := 0.22          # 札どうしの摩擦
const FLY_OVER := 0.005        # 高さの差がこれ以上なら上を飛び越える
const FINGER_R := 0.011        # 指の太さ（半径）
const SUBSTEPS := 4

var cards: Array = []          # 盤上の札（card.gd）。取られて見えない札は除く
var finger_on := false
var finger_pos := Vector2.ZERO # 畳の上の指の位置（x, z）
var finger_vel := Vector2.ZERO
var held: Node3D = null        # 指で押さえて動かしている札
var _grab := Vector2.ZERO      # 札の中心から押した点まで（札の向きに対して固定）
var _quiet := 0.0
var _was_moving := false
var _m := 1.0
var _inv_i := 0.0


func _ready() -> void:
	_inv_i = 12.0 / (W * W + H * H)


# ---------- 指 ----------

## 押した。札の上なら、その札を指で押さえる。
func finger_down(p: Vector2, card: Node3D) -> void:
	finger_on = true
	finger_pos = p
	finger_vel = Vector2.ZERO
	held = card
	if card:
		_wake(card)
		card.stop_tween()
		_grab = p - _p(card)
		_mark(card, "player")


## 指が動いた（毎フレーム呼ぶ）。dt は前回からの時間。
func finger_move(p: Vector2, dt: float) -> void:
	if not finger_on:
		return
	var v := (p - finger_pos) / maxf(dt, 0.001)
	finger_vel = finger_vel.lerp(v, 0.6)   # 指のぶれを少しならす
	finger_pos = p


## 離した。押さえていた札を、指の勢い×boost で放つ。速いほど少し浮く。
func finger_up(boost: float, max_speed: float) -> void:
	finger_on = false
	if held:
		var v := finger_vel * boost
		if v.length() > max_speed:
			v = v.normalized() * max_speed
		held.pv = v
		held.pw += randf_range(-1.0, 1.0) * clampf(v.length() * 1.5, 0.0, 4.0)
		held.vy = clampf(v.length() * 0.09, 0.0, 0.45)
		_wake(held)
	held = null


## 札を勢いよく払う（ロボット用）。at は札の中心からの当たる点（ずれるほど回る）。
func strike(card: Node3D, v: Vector2, at: Vector2, agent: String) -> void:
	card.stop_tween()
	_wake(card)
	_mark(card, agent)
	_apply(card, v * _m, at)
	card.vy = clampf(v.length() * 0.08, 0.0, 0.4)


# ---------- 計算 ----------

func _physics_process(delta: float) -> void:
	var h := delta / SUBSTEPS
	for i in SUBSTEPS:
		_step(h)
	var moving := false
	for c in cards:
		if c.dyn:
			moving = true
		_apply_visual(c)
	if moving or finger_on:
		_quiet = 0.0
		_was_moving = true
	elif _was_moving:
		_quiet += delta
		if _quiet > 0.2:
			_was_moving = false
			settled.emit()


func is_moving() -> bool:
	if finger_on:
		return true
	for c in cards:
		if c.dyn:
			return true
	return false


func _step(dt: float) -> void:
	# 押さえている札は指に合わせて動かす（指が回しても札の向きは変えない）
	if held:
		var p: Vector2 = finger_pos - _grab
		held.pv = (p - _p(held)) / dt
		held.pw = 0.0
		held.position.x = p.x
		held.position.z = p.y
		held.hy = 0.0
		held.vy = 0.0

	for c in cards:
		if not c.dyn or c == held:
			continue
		# 高さ
		if c.hy > 0.0 or c.vy > 0.0:
			c.vy -= G * dt
			c.hy += c.vy * dt
			if c.hy <= 0.0:
				c.hy = 0.0
				c.vy = -c.vy * 0.2 if c.vy < -0.25 else 0.0
		var grounded: bool = c.hy <= 0.0005
		var s: float = c.pv.length()
		if grounded:
			if s > 0.0:
				c.pv *= maxf(0.0, s - MU_FLOOR * G * dt) / s
			var dw: float = ANG_FRICTION * dt
			c.pw = 0.0 if absf(c.pw) <= dw else c.pw - signf(c.pw) * dw
		else:
			c.pv *= 1.0 - 0.4 * dt
		c.position.x += c.pv.x * dt
		c.position.z += c.pv.y * dt
		c.yaw += c.pw * dt
		# 遠くまで飛んだ札はそこで止める（画面のずっと外）
		if absf(c.position.x) > 1.2 or absf(c.position.z) > 1.2:
			c.pv = Vector2.ZERO
			c.pw = 0.0
			c.hy = 0.0
			c.vy = 0.0
		# 止まった
		if grounded and c.pv.length() < 0.008 and absf(c.pw) < 0.08 and c.vy == 0.0:
			c.sleep_t += dt
			if c.sleep_t > 0.06:
				c.dyn = false
				c.pv = Vector2.ZERO
				c.pw = 0.0
		else:
			c.sleep_t = 0.0

	# 指が通った札を払う
	if finger_on and finger_vel.length() > 0.04:
		for c in cards:
			if c == held:
				continue
			var local := _to_local(c, finger_pos)
			var cx := clampf(local.x, -W * 0.5, W * 0.5)
			var cz := clampf(local.y, -H * 0.5, H * 0.5)
			if (local - Vector2(cx, cz)).length() > FINGER_R:
				continue
			var r := _to_world_dir(c, Vector2(cx, cz))
			var vpt := _vel_at(c, r)
			var want := finger_vel * 0.85
			var dv := want - vpt
			if dv.dot(finger_vel) <= 0.0:
				continue
			c.stop_tween()
			_wake(c)
			_mark(c, "player")
			_apply(c, dv * _m * 0.5, r)

	# 札どうし
	var n := cards.size()
	for i in n:
		var a: Node3D = cards[i]
		for j in range(i + 1, n):
			var b: Node3D = cards[j]
			if not (a.dyn or a == held or b.dyn or b == held):
				continue
			if absf(a.hy - b.hy) > FLY_OVER:
				continue
			_collide(a, b)


func _collide(a: Node3D, b: Node3D) -> void:
	var pa := _p(a)
	var pb := _p(b)
	if pa.distance_to(pb) > 0.092:   # 対角線の長さより離れていれば重ならない
		return
	var axes := [_ax(a), _az(a), _ax(b), _az(b)]
	var d := pb - pa
	var best := INF
	var nrm := Vector2.ZERO
	for ax in axes:
		var ra := absf(ax.dot(_ax(a))) * W * 0.5 + absf(ax.dot(_az(a))) * H * 0.5
		var rb := absf(ax.dot(_ax(b))) * W * 0.5 + absf(ax.dot(_az(b))) * H * 0.5
		var dist: float = ax.dot(d)
		var over: float = ra + rb - absf(dist)
		if over <= 0.0:
			return
		if over < best:
			best = over
			nrm = ax if dist >= 0.0 else -ax
	# 当たった点：相手の内側に入った角の平均
	var pts: Array[Vector2] = []
	for v in _corners(b):
		if _inside(a, v):
			pts.append(v)
	for v in _corners(a):
		if _inside(b, v):
			pts.append(v)
	var cp := (pa + pb) * 0.5
	if pts.size() > 0:
		cp = Vector2.ZERO
		for v in pts:
			cp += v
		cp /= pts.size()

	var ia := 0.0 if a == held else 1.0 / _m
	var ib := 0.0 if b == held else 1.0 / _m
	var ja := 0.0 if a == held else _inv_i
	var jb := 0.0 if b == held else _inv_i
	if ia + ib == 0.0:
		return
	# めり込みを戻す
	var push := nrm * best * 0.9 / (ia + ib)
	if a != held:
		a.position.x -= push.x * ia
		a.position.z -= push.y * ia
	if b != held:
		b.position.x += push.x * ib
		b.position.z += push.y * ib

	var ra2 := cp - pa
	var rb2 := cp - pb
	var rel := _vel_at(b, rb2) - _vel_at(a, ra2)
	var vn := rel.dot(nrm)
	if vn >= 0.0:
		return
	var ka := _cross(ra2, nrm)
	var kb := _cross(rb2, nrm)
	var jn := -(1.0 + RESTITUTION) * vn / (ia + ib + ka * ka * ja + kb * kb * jb)
	var imp := nrm * jn
	# すべりの摩擦
	var t := rel - nrm * vn
	if t.length() > 0.0001:
		var tn := t.normalized()
		var kta := _cross(ra2, tn)
		var ktb := _cross(rb2, tn)
		var jt := -rel.dot(tn) / (ia + ib + kta * kta * ja + ktb * ktb * jb)
		jt = clampf(jt, -MU_CARD * jn, MU_CARD * jn)
		imp += tn * jt

	for c in [a, b]:
		if c != held and not c.dyn:
			c.stop_tween()
			_wake(c)
	if a != held:
		_apply(a, -imp, ra2)
	if b != held:
		_apply(b, imp, rb2)

	# 誰の動きでぶつかったかを受け渡す（強く当たったほうの札から）
	var src: Node3D = a if _speed(a) >= _speed(b) else b
	var dst: Node3D = b if src == a else a
	if src.agent != "" and jn > 0.02:
		_mark(dst, src.agent)

	# 強く当たった札は少し浮いて飛び散る
	if jn > 0.35:
		var hop := clampf(jn * randf_range(0.10, 0.22), 0.0, 0.5)
		if dst != held:
			dst.vy = maxf(dst.vy, hop)
			dst.flutter = randf_range(-1.0, 1.0)


func _apply(c: Node3D, imp: Vector2, r: Vector2) -> void:
	c.pv += imp / _m
	c.pw += _cross(r, imp) * _inv_i


func _wake(c: Node3D) -> void:
	c.dyn = true
	c.sleep_t = 0.0


func _mark(c: Node3D, agent: String) -> void:
	if c.agent == agent:
		return
	if c.agent == "" or agent == "player":
		c.agent = agent
		touched.emit(c, agent)


## 見た目：浮いている札は進む向きに少し傾ける
func _apply_visual(c: Node3D) -> void:
	c.position.y = c.layer_y + c.hy
	var tilt: float = clampf(c.hy * 14.0, 0.0, 0.7) * c.flutter
	if absf(tilt) > 0.001 and c.pv.length() > 0.01:
		var dir: Vector2 = c.pv.normalized()
		var axis := Vector3(dir.x, 0, dir.y).cross(Vector3.UP).normalized()
		c.basis = Basis(axis, tilt) * Basis(Vector3.UP, c.yaw)
	else:
		c.basis = Basis(Vector3.UP, c.yaw)
	if c.hy <= 0.0:
		c.flutter = 0.0


# ---------- 図形の部品（畳の面を (x, z) の 2 次元で扱う） ----------

func _p(c: Node3D) -> Vector2:
	return Vector2(c.position.x, c.position.z)


func _ax(c: Node3D) -> Vector2:   # 札の横向き
	var y: float = c.yaw
	return Vector2(cos(y), -sin(y))


func _az(c: Node3D) -> Vector2:   # 札の縦向き
	var y: float = c.yaw
	return Vector2(sin(y), cos(y))


func _corners(c: Node3D) -> Array[Vector2]:
	var p := _p(c)
	var x := _ax(c) * W * 0.5
	var z := _az(c) * H * 0.5
	return [p + x + z, p + x - z, p - x + z, p - x - z]


func _to_local(c: Node3D, w: Vector2) -> Vector2:
	var d := w - _p(c)
	return Vector2(d.dot(_ax(c)), d.dot(_az(c)))


func _to_world_dir(c: Node3D, l: Vector2) -> Vector2:
	return _ax(c) * l.x + _az(c) * l.y


func _inside(c: Node3D, w: Vector2) -> bool:
	var l := _to_local(c, w)
	return absf(l.x) <= W * 0.5 + 0.0005 and absf(l.y) <= H * 0.5 + 0.0005


## 回る札の上の点の速さ（r は中心から）。y 軸まわりの回転 w で点は (w*rz, -w*rx) 動く。
func _vel_at(c: Node3D, r: Vector2) -> Vector2:
	return c.pv + Vector2(c.pw * r.y, -c.pw * r.x)


func _cross(r: Vector2, f: Vector2) -> float:
	return r.y * f.x - r.x * f.y


func _speed(c: Node3D) -> float:
	return c.pv.length() + absf(c.pw) * 0.03
