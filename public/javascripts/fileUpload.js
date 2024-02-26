// File pond plugin register is done here

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);

FilePond.setOptions({
    stylePanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150,
});

// turn all file input elements into ponds
FilePond.parser(document.body);