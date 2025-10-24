// دالة لتحريك الأرقام بشكل متدرج
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment >= 0 && current >= end) || (increment < 0 && current <= end)) {
            clearInterval(timer);
            element.textContent = Number(end).toLocaleString('ar-SA');
        } else {
            element.textContent = Number(current).toLocaleString('ar-SA');
        }
    }, 16);
}

// دالة لتبديل الوضع الليلي/النهاري
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-switch i');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    }
    
    // تحديث الرسوم البيانية
    updateAllCharts();
}

// دالة لإنشاء وتحديث الرسوم البيانية
function createChart(canvasId, labels, data, label, backgroundColor, borderColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // التحقق مما إذا كان الرسم البياني موجودًا بالفعل
    if (window.charts && window.charts[canvasId]) {
        window.charts[canvasId].data.datasets[0].data = data;
        window.charts[canvasId].update();
        return;
    }
    
    // إنشاء رسم بياني جديد
    if (!window.charts) window.charts = {};
    
    const isDarkMode = !document.body.classList.contains('light-mode');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    
    window.charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        }
    });
}

// دالة لتحديث جميع الرسوم البيانية
function updateAllCharts() {
    if (window.charts) {
        const isDarkMode = !document.body.classList.contains('light-mode');
        const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        for (const chartId in window.charts) {
            const chart = window.charts[chartId];
            
            // تحديث ألوان النص والشبكة
            chart.options.scales.y.ticks.color = textColor;
            chart.options.scales.x.ticks.color = textColor;
            chart.options.scales.y.grid.color = gridColor;
            chart.options.scales.x.grid.color = gridColor;
            chart.options.plugins.legend.labels.color = textColor;
            
            chart.update();
        }
    }
}

// دالة لحفظ النتائج
function saveResults(calculatorId) {
    let data = {};
    let filename = '';
    
    switch(calculatorId) {
        case 'file-size':
            data = {
                width: document.getElementById('resolution-width').value,
                height: document.getElementById('resolution-height').value,
                colorDepth: document.getElementById('color-depth').value,
                frameRate: document.getElementById('frame-rate').value,
                duration: document.getElementById('duration').value,
                result: document.getElementById('file-size-result').textContent
            };
            filename = 'file-size-results.json';
            break;
            
        case 'aspect-ratio':
            data = {
                originalWidth: document.getElementById('original-width').value,
                originalHeight: document.getElementById('original-height').value,
                targetRatio: document.getElementById('target-ratio').value,
                newDimensions: document.getElementById('new-dimensions').textContent,
                cropArea: document.getElementById('crop-area').textContent
            };
            filename = 'aspect-ratio-results.json';
            break;
            
        case 'compression':
            data = {
                originalSize: document.getElementById('original-size').value,
                compressedSize: document.getElementById('compressed-size').value,
                compressionRatio: document.getElementById('compression-ratio').textContent,
                savedSpace: document.getElementById('saved-space').textContent
            };
            filename = 'compression-results.json';
            break;
            
        case 'audio-quality':
            data = {
                bitRate: document.getElementById('bit-rate').value,
                sampleRate: document.getElementById('sample-rate').value,
                duration: document.getElementById('audio-duration').value,
                fileSize: document.getElementById('audio-file-size').textContent,
                snr: document.getElementById('snr').textContent
            };
            filename = 'audio-quality-results.json';
            break;
    }
    
    // تحويل البيانات إلى نص JSON
    const jsonData = JSON.stringify(data, null, 2);
    
    // إنشاء رابط تنزيل
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // تنظيف
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// دالة لمشاركة النتائج
function shareResults(calculatorId) {
    let text = '';
    
    switch(calculatorId) {
        case 'file-size':
            text = `حاسبة حجم الملف - الحجم التقريبي: ${document.getElementById('file-size-result').textContent} ميجابايت`;
            break;
            
        case 'aspect-ratio':
            text = `مُحسِّن الأبعاد - الأبعاد الجديدة: ${document.getElementById('new-dimensions').textContent}`;
            break;
            
        case 'compression':
            text = `محلل كفاءة الضغط - نسبة الضغط: ${document.getElementById('compression-ratio').textContent}%`;
            break;
            
        case 'audio-quality':
            text = `حاسبة جودة الصوت - حجم الملف: ${document.getElementById('audio-file-size').textContent} ميجابايت`;
            break;
    }
    
    // استخدام واجهة مشاركة الويب إذا كانت متوفرة
    if (navigator.share) {
        navigator.share({
            title: 'حاسبة وكفاءة الوسائط',
            text: text,
            url: window.location.href
        }).catch(err => {
            console.error('حدث خطأ أثناء المشاركة:', err);
            alert('نسخ إلى الحافظة: ' + text);
            copyToClipboard(text);
        });
    } else {
        // نسخ النص إلى الحافظة كبديل
        alert('نسخ إلى الحافظة: ' + text);
        copyToClipboard(text);
    }
}

// دالة مساعدة لنسخ النص إلى الحافظة
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// حاسبة حجم الملف
function calculateFileSize() {
    const width = Number(document.getElementById('resolution-width').value);
    const height = Number(document.getElementById('resolution-height').value);
    const colorDepth = Number(document.getElementById('color-depth').value);
    const frameRate = Number(document.getElementById('frame-rate').value);
    const duration = Number(document.getElementById('duration').value);
    
    // الحصول على قيم الخيارات المتقدمة إذا كانت متاحة
    let compressionFactor = 1;
    if (document.getElementById('file-format')) {
        const format = document.getElementById('file-format').value;
        const compressionLevel = document.getElementById('compression-level') ? 
            Number(document.getElementById('compression-level').value) / 100 : 0.5;
        
        // تطبيق عوامل الضغط بناءً على الصيغة
        switch(format) {
            case 'jpg':
                compressionFactor = 0.1 + (0.3 * (1 - compressionLevel));
                break;
            case 'png':
                compressionFactor = 0.5 + (0.3 * (1 - compressionLevel));
                break;
            case 'mp4-h264':
                compressionFactor = 0.05 + (0.15 * (1 - compressionLevel));
                break;
            case 'mp4-h265':
                compressionFactor = 0.03 + (0.07 * (1 - compressionLevel));
                break;
            default: // raw
                compressionFactor = 1;
        }
    }
    
    // حساب الحجم بالبايت
    const bitsPerPixel = colorDepth;
    const bytesPerPixel = bitsPerPixel / 8;
    const totalPixels = width * height;
    const bytesPerFrame = totalPixels * bytesPerPixel;
    const totalBytes = bytesPerFrame * frameRate * duration;
    
    // تطبيق عامل الضغط
    const compressedBytes = totalBytes * compressionFactor;
    
    // تحويل إلى ميجابايت
    const sizeMB = compressedBytes / (1024 * 1024);
    
    const resultElement = document.getElementById('file-size-result');
    const currentValue = Number(resultElement.textContent.replace(/,/g, ''));
    animateNumber(resultElement, currentValue, Math.round(sizeMB), 500);
    
    // تحديث الرسم البياني
    if (document.getElementById('file-size-chart')) {
        const labels = ['حجم الملف (ميجابايت)'];
        const data = [Math.round(sizeMB)];
        createChart('file-size-chart', labels, data, 'حجم الملف', 
                   ['rgba(0, 247, 255, 0.6)'], ['rgba(0, 247, 255, 1)']);
    }
}

// محسن الأبعاد
function calculateAspectRatio() {
    const originalWidth = Number(document.getElementById('original-width').value);
    const originalHeight = Number(document.getElementById('original-height').value);
    
    // التحقق من وجود نسبة مخصصة
    let targetRatio, targetWidth, targetHeight;
    
    if (document.getElementById('custom-ratio-width') && 
        document.getElementById('custom-ratio-height') && 
        document.getElementById('advanced-aspect').classList.contains('active')) {
        // استخدام النسبة المخصصة
        targetWidth = Number(document.getElementById('custom-ratio-width').value);
        targetHeight = Number(document.getElementById('custom-ratio-height').value);
    } else {
        // استخدام النسبة المحددة مسبقًا
        targetRatio = document.getElementById('target-ratio').value;
        [targetWidth, targetHeight] = targetRatio.split(':').map(Number);
    }
    
    const targetAspectRatio = targetWidth / targetHeight;
    
    let newWidth, newHeight, cropArea;
    const originalAspectRatio = originalWidth / originalHeight;
    
    // التحقق من طريقة الاقتصاص
    let cropMethod = 'center';
    if (document.getElementById('crop-method')) {
        cropMethod = document.getElementById('crop-method').value;
    }
    
    if (originalAspectRatio > targetAspectRatio) {
        // الصورة أعرض من النسبة المستهدفة
        newHeight = originalHeight;
        newWidth = Math.round(originalHeight * targetAspectRatio);
        cropArea = (originalWidth - newWidth) * originalHeight;
    } else {
        // الصورة أطول من النسبة المستهدفة
        newWidth = originalWidth;
        newHeight = Math.round(originalWidth / targetAspectRatio);
        cropArea = (originalHeight - newHeight) * originalWidth;
    }
    
    const dimensionsElement = document.getElementById('new-dimensions');
    const cropElement = document.getElementById('crop-area');
    
    dimensionsElement.textContent = `${newWidth.toLocaleString('ar-SA')} × ${newHeight.toLocaleString('ar-SA')}`;
    animateNumber(cropElement, Number(cropElement.textContent.replace(/,/g, '')), cropArea, 500);
    
    // تحديث معاينة الإطارات
    if (document.getElementById('original-frame') && document.getElementById('new-frame')) {
        const originalFrame = document.getElementById('original-frame');
        const newFrame = document.getElementById('new-frame');
        
        // تعيين أبعاد الإطار الأصلي
        const maxFrameWidth = 160;
        const maxFrameHeight = 90;
        
        let frameWidth, frameHeight;
        
        if (originalWidth / originalHeight > maxFrameWidth / maxFrameHeight) {
            // الصورة أعرض من الإطار
            frameWidth = maxFrameWidth;
            frameHeight = maxFrameWidth * (originalHeight / originalWidth);
        } else {
            // الصورة أطول من الإطار
            frameHeight = maxFrameHeight;
            frameWidth = maxFrameHeight * (originalWidth / originalHeight);
        }
        
        originalFrame.style.width = `${frameWidth}px`;
        originalFrame.style.height = `${frameHeight}px`;
        
        // تعيين أبعاد الإطار الجديد
        let newFrameWidth, newFrameHeight;
        
        if (targetAspectRatio > maxFrameWidth / maxFrameHeight) {
            // النسبة المستهدفة أعرض من الإطار
            newFrameWidth = maxFrameWidth;
            newFrameHeight = maxFrameWidth / targetAspectRatio;
        } else {
            // النسبة المستهدفة أطول من الإطار
            newFrameHeight = maxFrameHeight;
            newFrameWidth = maxFrameHeight * targetAspectRatio;
        }
        
        newFrame.style.width = `${newFrameWidth}px`;
        newFrame.style.height = `${newFrameHeight}px`;
    }
}

// محلل كفاءة الضغط
function calculateCompression() {
    const originalSize = Number(document.getElementById('original-size').value);
    const compressedSize = Number(document.getElementById('compressed-size').value);
    
    // الحصول على قيم الخيارات المتقدمة إذا كانت متاحة
    let qualityFactor = 1;
    if (document.getElementById('compression-format') && document.getElementById('quality-level')) {
        const format = document.getElementById('compression-format').value;
        const qualityLevel = Number(document.getElementById('quality-level').value) / 100;
        
        // تعديل حجم الملف المضغوط بناءً على الصيغة ومستوى الجودة
        switch(format) {
            case 'jpg':
                qualityFactor = 0.1 + (0.5 * qualityLevel);
                break;
            case 'png':
                qualityFactor = 0.5 + (0.4 * qualityLevel);
                break;
            case 'webp':
                qualityFactor = 0.05 + (0.3 * qualityLevel);
                break;
            case 'h264':
                qualityFactor = 0.1 + (0.4 * qualityLevel);
                break;
            case 'h265':
                qualityFactor = 0.05 + (0.25 * qualityLevel);
                break;
        }
    }
    
    // حساب نسبة الضغط والمساحة المحفوظة
    const adjustedCompressedSize = compressedSize * qualityFactor;
    const compressionRatio = ((originalSize - adjustedCompressedSize) / originalSize) * 100;
    const savedSpace = originalSize - adjustedCompressedSize;
    
    const ratioElement = document.getElementById('compression-ratio');
    const savedElement = document.getElementById('saved-space');
    
    animateNumber(ratioElement, Number(ratioElement.textContent.replace(/,/g, '')), Math.round(compressionRatio), 500);
    animateNumber(savedElement, Number(savedElement.textContent.replace(/,/g, '')), Math.round(savedSpace), 500);
    
    // تحديث الرسم البياني
    if (document.getElementById('compression-chart')) {
        const labels = ['الحجم الأصلي', 'الحجم المضغوط', 'المساحة المحفوظة'];
        const data = [originalSize, Math.round(adjustedCompressedSize), Math.round(savedSpace)];
        createChart('compression-chart', labels, data, 'الحجم (ميجابايت)', 
                   ['rgba(78, 255, 145, 0.6)', 'rgba(0, 247, 255, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                   ['rgba(78, 255, 145, 1)', 'rgba(0, 247, 255, 1)', 'rgba(255, 99, 132, 1)']);
    }
}

// حاسبة جودة الصوت
function calculateAudioQuality() {
    const bitRate = Number(document.getElementById('bit-rate').value);
    const sampleRate = Number(document.getElementById('sample-rate').value);
    const duration = Number(document.getElementById('audio-duration').value);
    
    // الحصول على قيم الخيارات المتقدمة إذا كانت متاحة
    let formatFactor = 1;
    let channelCount = 2; // افتراضي: ستيريو
    
    if (document.getElementById('audio-format') && document.getElementById('channels')) {
        const format = document.getElementById('audio-format').value;
        channelCount = Number(document.getElementById('channels').value);
        
        // تعديل حجم الملف بناءً على الصيغة
        switch(format) {
            case 'mp3':
                formatFactor = 0.125; // ضغط بنسبة 8:1 تقريبًا
                break;
            case 'aac':
                formatFactor = 0.1; // ضغط بنسبة 10:1 تقريبًا
                break;
            case 'wav':
                formatFactor = 1; // بدون ضغط
                break;
            case 'flac':
                formatFactor = 0.5; // ضغط بدون فقدان بنسبة 2:1 تقريبًا
                break;
        }
    }
    
    // حساب حجم الملف بالبايت
    // الصيغة: معدل البت (بت/ثانية) × المدة (ثانية) ÷ 8 = الحجم (بايت)
    const fileSizeBytes = (bitRate * 1000 * duration * channelCount * formatFactor) / 8;
    
    // تحويل إلى ميجابايت
    const fileSizeMB = fileSizeBytes / (1024 * 1024);
    
    // حساب نسبة الإشارة إلى الضوضاء (SNR)
    // الصيغة التقريبية: SNR ≈ 6.02 × عمق البت + 1.76
    const bitDepth = Math.round(bitRate / (sampleRate * 1000 * channelCount));
    const snr = 6.02 * bitDepth + 1.76;
    
    const fileSizeElement = document.getElementById('audio-file-size');
    const snrElement = document.getElementById('snr');
    
    animateNumber(fileSizeElement, Number(fileSizeElement.textContent.replace(/,/g, '')), Math.round(fileSizeMB * 100) / 100, 500);
    animateNumber(snrElement, Number(snrElement.textContent.replace(/,/g, '')), Math.round(snr * 10) / 10, 500);
    
    // تحديث الرسم البياني
    if (document.getElementById('audio-quality-chart')) {
        const labels = ['حجم الملف (ميجابايت)', 'نسبة الإشارة إلى الضوضاء (ديسيبل)'];
        const data = [Math.round(fileSizeMB * 100) / 100, Math.round(snr * 10) / 10];
        createChart('audio-quality-chart', labels, data, 'جودة الصوت', 
                   ['rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                   ['rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)']);
    }
}

// إضافة مستمعي الأحداث
function addEventListeners() {
    // زر تبديل الوضع الليلي/النهاري
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', toggleTheme);
    }
    
    // علامات التبويب
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const parentCard = this.closest('.calculator-card');
            
            // إزالة الفئة النشطة من جميع الأزرار والمحتويات في هذه البطاقة
            parentCard.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            parentCard.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر والمحتوى المحدد
            this.classList.add('active');
            parentCard.querySelector(`#${tabId}`).classList.add('active');
            
            // إعادة حساب القيم
            if (parentCard.id === 'file-size-calculator') calculateFileSize();
            else if (parentCard.id === 'aspect-ratio-calculator') calculateAspectRatio();
            else if (parentCard.id === 'compression-calculator') calculateCompression();
            else if (parentCard.id === 'audio-quality-calculator') calculateAudioQuality();
        });
    });
    
    // أزرار الحفظ والمشاركة
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.id.split('-')[0]; // save أو share
            const calculatorType = this.id.split('-').slice(1).join('-'); // نوع الحاسبة
            
            if (action === 'save') {
                saveResults(calculatorType);
            } else if (action === 'share') {
                shareResults(calculatorType);
            }
        });
    });
    
    // حاسبة حجم الملف
    const fileSizeInputs = ['resolution-width', 'resolution-height', 'color-depth', 'frame-rate', 'duration'];
    fileSizeInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateFileSize);
    });
    
    // الخيارات المتقدمة لحاسبة حجم الملف
    if (document.getElementById('file-format')) {
        document.getElementById('file-format').addEventListener('change', calculateFileSize);
    }
    if (document.getElementById('compression-level')) {
        document.getElementById('compression-level').addEventListener('input', function() {
            document.getElementById('compression-level-value').textContent = this.value + '%';
            calculateFileSize();
        });
    }
    
    // محسن الأبعاد
    const aspectRatioInputs = ['original-width', 'original-height', 'target-ratio'];
    aspectRatioInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateAspectRatio);
    });
    
    // الخيارات المتقدمة لمحسن الأبعاد
    if (document.getElementById('custom-ratio-width')) {
        document.getElementById('custom-ratio-width').addEventListener('input', calculateAspectRatio);
    }
    if (document.getElementById('custom-ratio-height')) {
        document.getElementById('custom-ratio-height').addEventListener('input', calculateAspectRatio);
    }
    if (document.getElementById('crop-method')) {
        document.getElementById('crop-method').addEventListener('change', calculateAspectRatio);
    }
    
    // محلل كفاءة الضغط
    const compressionInputs = ['original-size', 'compressed-size'];
    compressionInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateCompression);
    });
    
    // الخيارات المتقدمة لمحلل كفاءة الضغط
    if (document.getElementById('compression-format')) {
        document.getElementById('compression-format').addEventListener('change', calculateCompression);
    }
    if (document.getElementById('quality-level')) {
        document.getElementById('quality-level').addEventListener('input', function() {
            document.getElementById('quality-level-value').textContent = this.value + '%';
            calculateCompression();
        });
    }
    
    // حاسبة جودة الصوت
    const audioQualityInputs = ['bit-rate', 'sample-rate', 'audio-duration'];
    audioQualityInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateAudioQuality);
    });
    
    // الخيارات المتقدمة لحاسبة جودة الصوت
    if (document.getElementById('audio-format')) {
        document.getElementById('audio-format').addEventListener('change', calculateAudioQuality);
    }
    if (document.getElementById('channels')) {
        document.getElementById('channels').addEventListener('change', calculateAudioQuality);
    }
}

// تشغيل الحسابات الأولية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من الوضع المحفوظ (ليلي/نهاري)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const themeIcon = document.querySelector('#theme-switch i');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // تشغيل الحسابات الأولية
    calculateFileSize();
    calculateAspectRatio();
    calculateCompression();
    if (document.getElementById('audio-quality-calculator')) {
        calculateAudioQuality();
    }
    
    // إضافة مستمعي الأحداث
    addEventListeners();
});