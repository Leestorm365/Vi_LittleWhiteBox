/**
 * Xiaobai X UI Vietnamese Mask Tool
 * Được phát triển bởi Tawa & Editor
 * Giúp đắp mặt nạ Tiếng Việt trực quan mà không ảnh hưởng đến Logic gốc.
 */

(function() {
    'use strict';

    // BẢNG TỪ ĐIỂN MẶT NẠ TIẾNG VIỆT (Editor có thể tự do chỉnh sửa hoặc thêm bớt)
    const dictionary = {
        "启用循环任务": "Bật nhiệm vụ tuần hoàn",
        "按钮栏": "Thanh nút bấm",
        "全局任务": "Nhiệm vụ toàn cục",
        "角色任务": "Nhiệm vụ nhân vật",
        "预设任务": "Nhiệm vụ cài sẵn (Preset)",
        "全局": "Toàn cục",
        "角色": "Nhân vật",
        "预设": "Cài sẵn",
        "任务下载": "Tải xuống nhiệm vụ",
        "导入": "Nhập (Import)",
        "这些任务在所有角色中的聊天都会执行": "Nhiệm vụ này sẽ chạy trong phòng chat của mọi nhân vật",
        "小白X": "Xiaobai X",
        "渲染交互": "Tương tác dựng hình",
        "循环任务": "Nhiệm vụ tuần hoàn",
        "数据互动": "Tương tác dữ liệu",
        "辅助工具": "Công cụ hỗ trợ",
        "启用小白X": "Kích hoạt Xiaobai X",
        "监控": "Giám sát",
        "渲染开关": "Bật/Tắt dựng hình",
        "渲染楼层": "Dựng hình số tầng",
        "启用Blob渲染": "Bật dựng hình Blob",
        "启用沉浸式模板": "Bật giao diện chìm",
        "当前角色模板设置": "Cài đặt mẫu nhân vật hiện tại",
        "编辑模板": "Sửa mẫu (Edit)",
        "请选择一个角色": "Vui lòng chọn một nhân vật",
        "功能文档": "Tài liệu tính năng",
        "默认开关": "Bật/tắt mặc định",
        "X按钮:右": "Nút X: Bên phải",
        "小白助手": "Trợ lý Xiaobai", // Đặt trước chữ "小白" để tránh bị dịch đè mất chữ "助手"
        "小白酒馆": "Tavern Xiaobai",
        "小白板": "Tiểu Bạch Bản (Bản đồ)",
        "小白": "Xiaobai",
        "电纸书": "E-Book (Sách điện tử)",
        "剧情总结": "Tóm tắt cốt truyện",
        "剧情规划": "Quy hoạch cốt truyện",
        "规划设置": "Cài đặt quy hoạch",
        "变量管理": "Quản lý biến số",
        "变量面板": "Bảng biến số",
        "Log记录": "Nhật ký Log",
        "Log拦截": "Bộ chặn Log (Interceptor)",
        "沉浸布局显示(边框窄化)": "Giao diện chìm (Viền hẹp)",
        "画图后端": "Engine vẽ tranh",
        "关闭": "Đóng (Tắt)",
        "画图设置": "Cài đặt vẽ tranh",
        "启用 TTS 语音": "Bật giọng nói TTS",
        "语音设置": "Cài đặt giọng nói"
    };

    // Hàm thực hiện thay thế nội dung trong một Text Node
    function translateTextNode(node) {
        let text = node.nodeValue;
        if (!text || !text.trim()) return;

        let changed = false;
        for (const [zh, vi] of Object.entries(dictionary)) {
            if (text.includes(zh)) {
                text = text.replaceAll(zh, vi);
                changed = true;
            }
        }
        if (changed) {
            node.nodeValue = text;
        }
    }

    // Hàm quét đệ quy qua các phần tử DOM hiển thị trên màn hình
    function walkAndTranslate(node) {
        let child = node.firstChild;
        while (child) {
            if (child.nodeType === Node.TEXT_NODE) {
                translateTextNode(child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // Tuyệt đối KHÔNG dịch các ô nhập liệu của người dùng hoặc code thô
                if (child.tagName !== 'INPUT' && child.tagName !== 'TEXTAREA' && child.tagName !== 'CODE' && child.tagName !== 'PRE') {
                    
                    // Dịch thêm thuộc tính placeholder và title nếu có chữ Trung
                    if (child.hasAttribute('placeholder')) {
                        let ph = child.getAttribute('placeholder');
                        let changed = false;
                        for (const [zh, vi] of Object.entries(dictionary)) {
                            if (ph.includes(zh)) {
                                ph = ph.replaceAll(zh, vi);
                                changed = true;
                            }
                        }
                        if (changed) child.setAttribute('placeholder', ph);
                    }

                    if (child.hasAttribute('title')) {
                        let title = child.getAttribute('title');
                        let changed = false;
                        for (const [zh, vi] of Object.entries(dictionary)) {
                            if (title.includes(zh)) {
                                title = title.replaceAll(zh, vi);
                                changed = true;
                            }
                        }
                        if (changed) child.setAttribute('title', title);
                    }

                    walkAndTranslate(child);
                }
            }
            child = child.nextSibling;
        }
    }

    // Lắng nghe sự thay đổi giao diện động (SillyTavern vẽ UI liên tục)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    walkAndTranslate(addedNode);
                }
            }
        }
    });

    // Kích hoạt khi trang web load hoặc khi script được import
    function initMask() {
        console.log("[Xiaobai-Mask] Mặt nạ Tiếng Việt đã được kích hoạt thành công! ✨");
        walkAndTranslate(document.body);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMask);
    } else {
        initMask();
    }
})();
