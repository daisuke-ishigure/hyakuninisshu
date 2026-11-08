// 札の面（取り札・絵札）。画像を貼り、角を丸く切り抜く。
shader_type spatial;
render_mode cull_back;

uniform sampler2D tex : source_color, filter_linear_mipmap;
uniform float aspect = 0.716;   // 横 / 縦（53 / 74）
uniform float radius = 0.035;   // 角の丸み（縦の長さに対する割合）
uniform float glow = 0.0;       // 光らせる量（正解の演出用）
uniform vec3 glow_color : source_color = vec3(1.0, 0.85, 0.4);
uniform float dim = 0.0;        // 暗くする量（お手つきの演出用）

void fragment() {
	vec2 p = (UV - 0.5) * vec2(aspect, 1.0);
	vec2 half_size = vec2(aspect, 1.0) * 0.5 - radius;
	float d = length(max(abs(p) - half_size, 0.0)) - radius;
	if (d > 0.0) {
		discard;
	}
	vec3 col = texture(tex, UV).rgb;
	col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))) * 0.6, dim);
	ALBEDO = col;
	EMISSION = glow_color * glow;
	ROUGHNESS = 0.55;
	SPECULAR = 0.35;
}
