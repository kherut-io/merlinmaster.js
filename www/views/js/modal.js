function modal(data) {
    this.title = data.title;
    this.text = data.text;
    this.buttons = (data.buttons != undefined ? data.buttons : []);
    this.buttonsFunctions = (data.buttonsFunctions != undefined ? data.buttonsFunctions : []);
    this.closeButtonVisible = (data.closeButtonVisible != undefined ? data.closeButtonVisible : true);
    this.centerContent = (data.centerContent != undefined ? data.centerContent : false);

    this.close = function() {
        $('.modal').fadeOut(300, function() {
            $(this).remove();
        });
    };

    this.show = function() {
        var html = '<div class="modal ' + (this.centerContent ? 'center' : '') + '">\
            <div class="modal-content">\
                ' + (this.closeButtonVisible ? '<span class="modal-close">&times;</span>' : '') + '\
                <div class="modal-header">\
                ' + this.title + '\
                </div>\
                ' + this.text + (this.buttons.length > 0 ? '<br><div class="modal-buttonsContainer">' : '');

        for(var i = 0; i < this.buttons.length; i++) {
            html += '<button class="modal-button" id="modal-button-' + i + '">' + this.buttons[i] + '</button>';

            $('body').on('click', '#modal-button-' + i, this.buttonsFunctions[i]);
        }

        html += (this.buttons.length > 0 ? '</div>' : '') + '\
            </div>\
        </div>';

        $('body').append(html);

        $('body').on('click', '.modal .modal-close', function() {
            $('.modal').fadeOut(300, function() {
                $(this).remove();
            });
        });
    };
}