// 畳。画像を使わず、い草の細い筋と色むらを計算で描く（後で写真の質感に差し替えてもよい）。
shader_type spatial;

uniform vec3 base_color : source_color = vec3(0.62, 0.60, 0.40);
uniform float rows = 1400.0;      // い草の筋の本数（UV の縦方向）
uniform float border = 0.035;     // 畳縁の幅（UV 単位）
uniform vec3 border_color : source_color = vec3(0.10, 0.16, 0.12);

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void fragment() {
	float line = sin(UV.y * rows * 3.14159) * 0.5 + 0.5;
	float cell = hash(floor(UV * vec2(90.0, rows)));
	float patch = hash(floor(UV * vec2(6.0, 9.0)));
	vec3 col = base_color * (0.90 + 0.10 * line) * (0.94 + 0.06 * cell) * (0.96 + 0.04 * patch);
	float b = step(UV.x, border) + step(1.0 - border, UV.x);
	col = mix(col, border_color, clamp(b, 0.0, 1.0));
	ALBEDO = col;
	ROUGHNESS = 0.9;
	SPECULAR = 0.2;
}
