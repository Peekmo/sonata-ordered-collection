// Order elements
var reorderElements = function() {
    var elements = new Array();
    jQuery('.umanit-sortable-element').each(function(index) {
        var parent = jQuery(this).closest('.umanit-sortable-collection>:first-child');
        if (elements[parent.attr('id')] == undefined) {
            elements[parent.attr('id')] = new Array();
        }

        elements[parent.attr('id')].push(jQuery(this));
    });

    for (key in elements) {
        var total = elements[key].length;

        for (index=0; index<total; index++) {
            var e = elements[key][index];

            e.find('.umanit-sortable-order').first().attr('value', index+1);

            if (index == 0) {
                e.closest('.umanit-sortable-element').children('.umanit-sort-up').hide();
            } else {
                e.closest('.umanit-sortable-element').children('.umanit-sort-up').show();
            }

            if (index+1 == total) {
                e.closest('.umanit-sortable-element').children('.umanit-sort-down').hide();
            } else {
                e.closest('.umanit-sortable-element').children('.umanit-sort-down').show();
            }
        }
    }
};


// Register up/down ecents
var registerEvents = function() {
    /**
     * Reset CKEditor cause it doesn't work when the editor is moving in the DOM 
     */
    var resetCkEditor = function(container) {
        if (typeof CKEDITOR !== 'undefined' && Object.keys(CKEDITOR.instances).length) {
            for (instance in CKEDITOR.instances) {
                if (container.find('#' + instance).length > 0) {
                    var config = CKEDITOR.instances[instance].config;

                    CKEDITOR.instances[instance].destroy();
                    CKEDITOR.replace(instance, config);    
                }
            }
        }
    }

    jQuery(".umanit-sort-up").on('click', function() {
        var parent = jQuery(this).parent('.umanit-sortable-element');
        var previous = parent.prev('.umanit-sortable-element');

        if (previous.length > 0) {
            parent.after(previous);
            reorderElements();
            resetCkEditor(previous);
        }
    });

    jQuery(".umanit-sort-down").on('click', function() {
        var parent = jQuery(this).parent('.umanit-sortable-element');
        var next = parent.next('.umanit-sortable-element');

        if (next.length > 0) {
            parent.before(next);
            reorderElements();
            resetCkEditor(next);
        }
    });

    // Reorder on add
    jQuery('.sonata-collection-add').on('sonata-collection-item-added', function() {
        registerEvents();
        reorderElements();
        hideButtons();
    });

    // Reorder on deletion
    jQuery('.sonata-collection-delete').on('sonata-collection-item-deleted', function() {
        jQuery(this).parent().find('.umanit-sortable-order').first().removeClass('umanit-sortable-order');
        jQuery(this).parent().removeClass('umanit-sortable-element');
        registerEvents();
        reorderElements();
        hideButtons();
    });
};

var hideButtons = function() {
    jQuery('.umanit-sortable-collection').each(function() {
        jQuery(this).find('.sonata-collection-add').first().show();
        jQuery(this).find('.sonata-collection-delete').first().show();

        var max = jQuery(this).find('.umanit-collection-collection_max_items').first().data('value');
        var min = jQuery(this).find('.umanit-collection-collection_min_items').first().data('value');
        var orderable = jQuery(this).find('.umanit-collection-collection_orderable').first().data('value');

        var elements = jQuery(this).find('.umanit-sortable-element').length;

        if (max && elements >= max) {
            jQuery(this).find('.sonata-collection-add').first().hide();
        }

        if (min && elements <= min) {
            jQuery(this).find('.sonata-collection-delete').first().hide();
        }

        if (orderable == "0") {
            jQuery(this).find('.umanit-sort-up').hide();
            jQuery(this).find('.umanit-sort-down').hide();
        }
    });
};

jQuery(document).ready(function() {
    registerEvents();
    reorderElements();
    hideButtons();

    // For a2lixtranslation bundler
    jQuery(document).on('click', 'a[data-target^=".a2lix_translationsFields-"]', function() {
        jQuery('a[data-target^=".a2lix_translationsFields-"]').parent('li').removeClass('active');
        jQuery('a[data-target="' + jQuery(this).data('target') + '"]').parent('li').addClass('active');
    });
});

