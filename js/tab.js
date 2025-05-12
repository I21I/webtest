function handleTabClick() {
    if (this.classList.contains('active')) return;
    
    const tabContainer = this.closest('.tabs');
    tabContainer.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    this.classList.add('active');
    
    const parentSection = this.closest('.info-box') || this.closest('section');
    
    const tabId = this.getAttribute('data-tab');
    
    if (parentSection) {
        parentSection.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = parentSection.querySelector('#' + tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    } else {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabId + '-tab');
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const firstTab = tabContainer.querySelector('.tab');
        if (firstTab && !firstTab.classList.contains('active')) {
            firstTab.click();
        }
    });
}
