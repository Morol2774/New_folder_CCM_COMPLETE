// ═════════════════════════════════════════════════════════
//  CCM PANEL LOADER
// ═════════════════════════════════════════════════════════
console.log('✓ CCM Script loaded');

function openCCMPanel() {
    console.log('✓ openCCMPanel called');
    var overlay = document.getElementById('ccm-overlay');
    var panel = document.getElementById('ccm-panel');

    if (!overlay || !panel) {
        console.error('❌ CCM elements not found!');
        return;
    }

    overlay.style.display = 'block';
    overlay.style.opacity = '1';
    panel.style.right = '0';
    document.body.style.overflow = 'hidden';

    if (!panel.hasAttribute('data-loaded')) {
        fetch('ccm-dashboard.html')
            .then(r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(html => {
                var temp = document.createElement('div');
                temp.innerHTML = html;

                var styles = temp.querySelectorAll('style');
                styles.forEach(s => document.head.appendChild(s.cloneNode(true)));

                var scripts = temp.querySelectorAll('script');
                var content = [];

                for (var i = 0; i < temp.childNodes.length; i++) {
                    var node = temp.childNodes[i];
                    if (node.nodeType === 1 && node.nodeName !== 'STYLE' && node.nodeName !== 'SCRIPT') {
                        content.push(node.cloneNode(true));
                    }
                }

                panel.innerHTML = '';
                content.forEach(n => panel.appendChild(n));

                scripts.forEach(s => {
                    var newScript = document.createElement('script');
                    newScript.textContent = s.textContent;
                    document.body.appendChild(newScript);
                });

                panel.setAttribute('data-loaded', '1');
                console.log('✓ CCM Dashboard loaded successfully');
            })
            .catch(e => {
                panel.innerHTML = '<div style="color:red;padding:20px">Error: ' + e.message + '</div>';
                console.error('❌ Error loading CCM:', e);
            });
    }
}

function closeCCMPanel() {
    console.log('✓ closeCCMPanel called');
    var overlay = document.getElementById('ccm-overlay');
    var panel = document.getElementById('ccm-panel');

    overlay.style.display = 'none';
    overlay.style.opacity = '0';
    panel.style.right = '-100%';
    document.body.style.overflow = '';
}

function initCCMLoader() {
    console.log('✓ initCCMLoader - wiring CCM button...');

    var overlay = document.getElementById('ccm-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeCCMPanel);
    }

    var wireBtn = setInterval(function() {
        var btns = document.querySelectorAll('button.btn-link');
        for (var i = 0; i < btns.length; i++) {
            var btnText = btns[i].textContent || '';
            if (btnText.indexOf('CC Manual') !== -1) {
                console.log('✓ Found CC Manual button!');
                if (!btns[i].hasAttribute('data-wired')) {
                    btns[i].setAttribute('data-wired', '1');
                    btns[i].addEventListener('click', function(e) {
                        console.log('✓ CC Manual clicked!');
                        e.preventDefault();
                        openCCMPanel();
                    });
                    console.log('✓ CC Manual button wired successfully!');
                    clearInterval(wireBtn);
                    return;
                }
            }
        }
    }, 100);

    setTimeout(() => {
        clearInterval(wireBtn);
        console.log('Timeout: CC Manual button search completed');
    }, 5000);
}

document.addEventListener('DOMContentLoaded', initCCMLoader);
