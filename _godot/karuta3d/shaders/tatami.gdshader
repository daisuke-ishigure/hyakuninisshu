// 畳の床。い草の質感は textures/tatami.webp を繰り返し貼り、畳縁と継ぎ目は計算で描く。
// 位置はワールド座標（1 単位 = 1m）で決めるので、床の大きさを変えても縮尺は変わらない。
shader_type spatial;

uniform sampler2D tatami_tex : source_color, filter_linear_mipmap_anisotropic, repeat_enable;
uniform vec2 tile_size = vec2(0.30, 0.1875);   // 画像 1 枚が覆う大きさ（m）。800×500px の画像なので 0.30m×0.1875m
uniform vec2 mat_size = vec2(0.9, 1.8);        // 畳 1 枚の大きさ（m）。長辺が奥行き方向
uniform float border_width = 0.03;             // 畳縁の幅（長辺だけに付く）
uniform vec3 border_color : source_color = vec3(0.12, 0.17, 0.13);
uniform float seam_width = 0.002;              // 短辺どうしの継ぎ目
uniform float brightness = 0.95;

varying vec3 world_pos;

void vertex() {
	world_pos = (MODEL_MATRIX * vec4(VERTEX, 1.0)).xyz;
}

void fragment() {
	vec3 col = texture(tatami_tex, world_pos.xz / tile_size).rgb * brightness;
	// 畳 1 枚の中での位置（0〜mat_size）。原点が畳の中央に来るようにずらす
	vec2 m = mod(world_pos.xz + mat_size * 0.5, mat_size);
	float border = step(m.x, border_width) + step(mat_size.x - border_width, m.x);
	float seam = step(m.y, seam_width) + step(mat_size.y - seam_width, m.y);
	col = mix(col, col * 0.55, clamp(seam, 0.0, 1.0));
	col = mix(col, border_color, clamp(border, 0.0, 1.0));
	ALBEDO = col;
	ROUGHNESS = 0.85;
	SPECULAR = 0.25;
}
