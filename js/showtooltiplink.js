function handleMarkerClick(element, target) {
    // 1. ツールチップを表示（不要ならこのif文ごと削除してOKです）
    if (typeof showTooltip === "function") {
        // ターゲットからツールチップ用のテキストを取得
        const tooltipText = target.replace('#', ''); // '#togubou' → 'togubou'
        showTooltip(element, tooltipText);
    }

    // 2. 即座にターゲットへ移動
    if (target) {
        location.href = target;
    }
}