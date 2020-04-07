$(document).ready(function() {
    document.selected_template = null;

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    $('.template').on('click', function(ev) {
        $('.template').removeClass('active');
        $(ev.target).addClass('active');
        document.selected_template = ev.target.getAttribute('id');
        if (ev.target.getAttribute('hasForm') === "true") {
            $('#btn-create-text').text('Next');
        } else {
            $('#btn-create-text').text('Create');
        }
    });
    $('.template').dblclick(function(ev) {
        $('.template').removeClass('active');
        $(ev.target).addClass('active');
        document.selected_template = ev.target.getAttribute('id');
        $('.fenix-page').hide();
        $('#page-form').show();
    });

    $('#btn-create').on('click', () => {
        // if (selected_template !== null)
        // console.log('Create: ' + document.selected_template);
        // vscode.postMessage({
        //     command: 'create',
        //     id: document.selected_template
        // });
        $('.fenix-page').hide();
        $('#page-form').show();
    });

    $('#tab-new-project').on('click', () => {
        $('.fenix-page').hide();
        $('#page-new-project').show();
    });

    $('#tab-repositories').on('click', () => {
        $('.fenix-page').hide();
        $('#page-repositories').show();
    });

    $('#tab-environment').on('click', () => {
        $('.fenix-page').hide();
        $('#page-environment').show();
    });
});