// 札の下に広がる光の輪（正解のとき）。中心ほど明るく、外へ向かって消える。
shader_type spatial;
render_mode unshaded, blend_add, depth_draw_never, cull_disabled;

uniform vec3 color : source_color = vec3(1.0, 0.82, 0.35);
uniform float intensity = 0.0;

void fragment() {
	float d = length(UV - 0.5) * 2.0;
	float a = pow(clamp(1.0 - d, 0.0, 1.0), 2.0);
	ALBEDO = color * a * intensity;
	ALPHA = clamp(a * intensity, 0.0, 1.0);
}
