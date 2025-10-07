// 图小小界面汉化脚本
(function() {
    console.log('🎨 图小小汉化脚本加载中...');
    
    // 等待页面完全加载
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // 汉化文本映射
    const textTranslations = {
        'Drop image here or click to select': '拖放图片到此处或点击选择',
        'Select image': '选择图片',
        'Original': '原图',
        'Compressed': '压缩后',
        'Original size': '原始大小',
        'File size': '文件大小',
        'Compress': '压缩',
        'Download': '下载',
        'Quality': '质量',
        'Effort': '压缩力度',
        'WebP': 'WebP格式',
        'AVIF': 'AVIF格式',
        'JPEG': 'JPEG格式',
        'PNG': 'PNG格式',
        'Settings': '设置',
        'Compare': '对比',
        'Edit': '编辑',
        'Resize': '调整大小',
        'Reduce palette': '减色',
        'Convert': '转换',
        'MozJPEG': 'MozJPEG',
        'OxiPNG': 'OxiPNG',
        'WebP Quality': 'WebP质量',
        'AVIF Quality': 'AVIF质量',
        'JPEG Quality': 'JPEG质量'
    };

    // 应用文本翻译
    function applyTranslations() {
        // 翻译所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const originalText = textNode.textContent.trim();
            if (textTranslations[originalText]) {
                textNode.textContent = textTranslations[originalText];
            }
        });

        // 翻译按钮和输入框的placeholder
        document.querySelectorAll('button, input, select, label').forEach(element => {
            const text = element.textContent?.trim();
            if (text && textTranslations[text]) {
                element.textContent = textTranslations[text];
            }

            const placeholder = element.getAttribute('placeholder');
            if (placeholder && textTranslations[placeholder]) {
                element.setAttribute('placeholder', textTranslations[placeholder]);
            }

            const title = element.getAttribute('title');
            if (title && textTranslations[title]) {
                element.setAttribute('title', textTranslations[title]);
            }
        });
    }

    // 初始化汉化
    function initializeLocalization() {
        console.log('✅ 开始汉化界面...');
        
        // 立即应用一次翻译
        applyTranslations();

        // 监听DOM变化，动态应用翻译
        const observer = new MutationObserver(() => {
            applyTranslations();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 定期重新应用翻译（处理延迟加载的内容）
        setInterval(applyTranslations, 2000);
        
        console.log('✅ 图小小汉化完成！');
    }

    // 等待页面加载完成后开始汉化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLocalization);
    } else {
        initializeLocalization();
    }

    // 添加自定义样式
    const customStyles = `
        <style>
        /* 图小小自定义样式 */
        .tuxiaoxiao-brand {
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        /* 美化按钮样式 */
        button:hover {
            transform: translateY(-1px);
            transition: transform 0.2s ease;
        }
        </style>
    `;

    // 注入自定义样式
    document.head.insertAdjacentHTML('beforeend', customStyles);

    // 添加品牌标识
    const brandElement = document.createElement('div');
    brandElement.className = 'tuxiaoxiao-brand';
    brandElement.innerHTML = '🎨 图小小';
    document.body.appendChild(brandElement);

})();
