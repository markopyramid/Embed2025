/**
 * File: js/discover-example.js
 * Description: Handles embedding multiple Pyramid "Discover" content items
 * and allows filtering them using an expanded hierarchical tree filter for 2023.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("DEBUG: DOMContentLoaded fired for discover-example.js (Expanded Tree Filter).");

    const filterTreeContainer = document.getElementById('hierarchical-filter-tree');
    const pyramidServerUrl = 'https://learn01.pyramidanalytics.com';
    let pyramidClient;
    let currentSelectedUmn = null; 

    const contentItems = [
        { id: 'discover-item-1', contentId: 'a93c990f-8faa-42b1-8c6d-7574cf89d57a', placeholderText: 'Loading Content Item 1...' },
        { id: 'discover-item-2', contentId: '3485657f-02f2-4739-a83f-ce23d4b8cb9e', placeholderText: 'Loading Content Item 2...' },
        { id: 'discover-item-3', contentId: 'a5cdbfe2-2bb4-4288-b746-33297bb26f37', placeholderText: 'Loading Content Item 3...' },
        { id: 'discover-item-4', contentId: '12b2343f-a48b-4bb8-b0bb-2ebfc2a0c67a', placeholderText: 'Loading Content Item 4...' },
        { id: 'discover-item-5', contentId: '60330405-25da-42cd-aaa0-1c595a4fe1b3', placeholderText: 'Loading Content Item 5...' },
        { id: 'discover-item-6', contentId: 'f87f9d49-cbfd-4554-9cac-b34f90a80cde', placeholderText: 'Loading Content Item 6...' }
    ];

// Replace the existing filterTreeData in Embed2025/js/discover-example.js with this:
const filterTreeData = [
    {
        id: 'node-2023',
        label: "2023", 
        umn: "[Calendar].^[Calendar].[2023]",
        isSelectable: true,
        defaultSelected: true, 
        expanded: true,        
        children: [
            // Q1 2023
            {
                id: 'node-q1-2023',
                label: "Q1 2023",
                umn: "[Calendar].^[Calendar].[2023].[Q1 2023]",
                isSelectable: true,
                expanded: false, 
                children: [
                    { id: 'node-jan-2023', label: "January 2023", umn: "[Calendar].^[Calendar].[2023].[Q1 2023].[Jan 2023]", isSelectable: true },
                    { id: 'node-feb-2023', label: "February 2023", umn: "[Calendar].^[Calendar].[2023].[Q1 2023].[Feb 2023]", isSelectable: true },
                    { id: 'node-mar-2023', label: "March 2023", umn: "[Calendar].^[Calendar].[2023].[Q1 2023].[Mar 2023]", isSelectable: true }
                ]
            },
            // Q2 2023
            {
                id: 'node-q2-2023',
                label: "Q2 2023",
                umn: "[Calendar].^[Calendar].[2023].[Q2 2023]",
                isSelectable: true,
                expanded: false,
                children: [
                    { id: 'node-apr-2023', label: "April 2023", umn: "[Calendar].^[Calendar].[2023].[Q2 2023].[Apr 2023]", isSelectable: true },
                    { id: 'node-may-2023', label: "May 2023", umn: "[Calendar].^[Calendar].[2023].[Q2 2023].[May 2023]", isSelectable: true },
                    { id: 'node-jun-2023', label: "June 2023", umn: "[Calendar].^[Calendar].[2023].[Q2 2023].[Jun 2023]", isSelectable: true }
                ]
            },
            // Q3 2023
            {
                id: 'node-q3-2023',
                label: "Q3 2023",
                umn: "[Calendar].^[Calendar].[2023].[Q3 2023]",
                isSelectable: true,
                expanded: false,
                children: [
                    { id: 'node-jul-2023', label: "July 2023", umn: "[Calendar].^[Calendar].[2023].[Q3 2023].[Jul 2023]", isSelectable: true },
                    { id: 'node-aug-2023', label: "August 2023", umn: "[Calendar].^[Calendar].[2023].[Q3 2023].[Aug 2023]", isSelectable: true },
                    { id: 'node-sep-2023', label: "September 2023", umn: "[Calendar].^[Calendar].[2023].[Q3 2023].[Sep 2023]", isSelectable: true }
                ]
            },
            // Q4 2023
            {
                id: 'node-q4-2023',
                label: "Q4 2023",
                umn: "[Calendar].^[Calendar].[2023].[Q4 2023]",
                isSelectable: true,
                expanded: true, 
                children: [
                    { id: 'node-oct-2023', label: "October 2023", umn: "[Calendar].^[Calendar].[2023].[Q4 2023].[Oct 2023]", isSelectable: true },
                    { id: 'node-nov-2023', label: "November 2023", umn: "[Calendar].^[Calendar].[2023].[Q4 2023].[Nov 2023]", isSelectable: true },
                    { id: 'node-dec-2023', label: "December 2023", umn: "[Calendar].^[Calendar].[2023].[Q4 2023].[Dec 2023]", isSelectable: true }
                ]
            }
        ]
    }
];

    if (!filterTreeContainer) {
        console.error('Page setup error: Required filter tree container not found.');
        contentItems.forEach(item => {
            const container = document.getElementById(item.id);
            if(container) container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Page setup error: Filter tree container missing.</p>`;
        });
        return;
    }

    if (typeof PyramidEmbedClient === 'undefined' || typeof Filter === 'undefined' || typeof Filter.create !== 'function') {
        const errorMsg = 'Error: Critical Pyramid Embed library components not found.';
        console.error(errorMsg);
        contentItems.forEach(item => {
            const container = document.getElementById(item.id);
            if(container) container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">${errorMsg}</p>`;
        });
        return;
    }

    try {
        pyramidClient = new PyramidEmbedClient(pyramidServerUrl);
        console.log('DEBUG: PyramidEmbedClient initialized ONCE.');
    } catch (error) {
        console.error('Error initializing PyramidEmbedClient:', error);
        contentItems.forEach(item => {
            const container = document.getElementById(item.id);
            if(container) container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Client init error: ${error.message}</p>`;
        });
        return;
    }

    function renderTreeNode(nodeData) {
        const li = document.createElement('li');
        li.id = nodeData.id;

        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';

        const toggleSpan = document.createElement('span');
        toggleSpan.className = 'tree-node-toggle';
        if (nodeData.children && nodeData.children.length > 0) {
            toggleSpan.innerHTML = `<i class="fas ${nodeData.expanded ? 'fa-minus-square' : 'fa-plus-square'}"></i>`;
            toggleSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                const childUl = li.querySelector('.child-nodes');
                if (childUl) {
                    childUl.classList.toggle('expanded');
                    toggleSpan.innerHTML = `<i class="fas ${childUl.classList.contains('expanded') ? 'fa-minus-square' : 'fa-plus-square'}"></i>`;
                }
            });
        } else {
            toggleSpan.innerHTML = `<i class="fas fa-leaf" style="opacity:0.3;"></i>`; 
        }

        const labelSpan = document.createElement('span');
        labelSpan.className = 'tree-node-label';
        labelSpan.textContent = nodeData.label;

        if (nodeData.isSelectable) {
            labelSpan.classList.add('selectable');
            labelSpan.dataset.umn = nodeData.umn;
            if (nodeData.umn === currentSelectedUmn) { 
                labelSpan.classList.add('selected');
            }
            labelSpan.addEventListener('click', () => {
                if (currentSelectedUmn !== nodeData.umn) {
                    const currentlySelectedElement = filterTreeContainer.querySelector('.tree-node-label.selected');
                    if (currentlySelectedElement) {
                        currentlySelectedElement.classList.remove('selected');
                    }
                    labelSpan.classList.add('selected');
                    currentSelectedUmn = nodeData.umn;
                    console.log(`DEBUG: Tree node selected. UMN: ${currentSelectedUmn}`);
                    embedDiscoverItems(currentSelectedUmn);
                }
            });
        }

        nodeDiv.appendChild(toggleSpan);
        nodeDiv.appendChild(labelSpan);
        li.appendChild(nodeDiv);

        if (nodeData.children && nodeData.children.length > 0) {
            const childUl = document.createElement('ul');
            childUl.className = 'child-nodes';
            if (nodeData.expanded) {
                childUl.classList.add('expanded');
            }
            nodeData.children.forEach(childNode => {
                childUl.appendChild(renderTreeNode(childNode));
            });
            li.appendChild(childUl);
        }
        return li;
    }

    function buildFilterTree(treeData, containerElement) {
        let defaultUmnFound = null;
        function findDefaultRecursive(nodes) {
            for (const node of nodes) {
                if (node.defaultSelected && node.isSelectable) {
                    defaultUmnFound = node.umn;
                    return true; 
                }
                if (node.children && findDefaultRecursive(node.children)) {
                    return true;
                }
            }
            return false;
        }
        findDefaultRecursive(treeData);
        currentSelectedUmn = defaultUmnFound; 

        const rootUl = document.createElement('ul');
        treeData.forEach(nodeData => {
            rootUl.appendChild(renderTreeNode(nodeData)); 
        });
        containerElement.innerHTML = ''; 
        containerElement.appendChild(rootUl);
    }
    
    const embedDiscoverItems = async (uniqueMemberName) => {
        console.log(`DEBUG: embedDiscoverItems called with UMN: ${uniqueMemberName}`);
        if (!pyramidClient) { console.error("PyramidClient not initialized."); return; }

        let filterForOptions;
        try {
            filterForOptions = Filter.create();
            if (uniqueMemberName && uniqueMemberName.trim() !== "") {
                filterForOptions.addUniqueName(uniqueMemberName);
            }
             console.log("DEBUG: Filter object for embed:", filterForOptions);
        } catch (creationError) {
            console.error('Error creating filter object:', creationError);
            contentItems.forEach(item => { 
                const c = document.getElementById(item.id);
                if(c) c.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Filter creation error: ${creationError.message}</p>`;
            });
            return; 
        }

        const embedPromises = contentItems.map(async (item) => {
            const container = document.getElementById(item.id);
            if (!container) { console.error(`Container DIV NOT FOUND for ID: ${item.id}.`); return; }

            if (item.contentId.startsWith('YOUR_CONTENT_ID_')) {
                const msg = `Configuration needed: Update contentId for ${item.id}. Currently: ${item.contentId}`;
                console.warn(msg);
                container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">${msg}</p>`;
                return; 
            }
            
            console.log(`DEBUG: Preparing to embed/re-embed ${item.id}.`);

            const embedOptions = {
                contentId: item.contentId,
                theme: "light",
                filters: filterForOptions,
                onLoad: (result) => {
                    console.log(`DEBUG: Content ${item.contentId} loaded successfully into ${item.id}.`);
                },
                onError: (error) => {
                    console.error(`DEBUG: Error embedding ${item.contentId} into ${item.id}:`, error);
                    if (container) {
                        container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Error loading: ${error.message || 'Unknown'}</p>`;
                    }
                }
            };
            try {
                console.log(`DEBUG: Calling embed for ${item.id}. Options:`, JSON.parse(JSON.stringify(embedOptions)));
                await pyramidClient.embed(container, embedOptions);
                console.log(`DEBUG: Embed call completed for ${item.id}.`);
            } catch (embedError) {
                console.error(`Error during embed call for ${item.id}:`, embedError);
                if (container) {
                     container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Embedding failed: ${embedError.message}</p>`;
                }
            }
        });
        try {
            await Promise.all(embedPromises.filter(p => p));
            console.log("DEBUG: All discover item embedding processes initiated.");
        } catch (error) { 
            console.error("DEBUG: Error during Promise.all execution:", error);
        }
    };

    buildFilterTree(filterTreeData, filterTreeContainer); 
    
    if (currentSelectedUmn) {
        console.log("DEBUG: Initial page load. Calling embedDiscoverItems with default UMN from tree:", currentSelectedUmn);
        embedDiscoverItems(currentSelectedUmn);
    } else {
        console.error("DEBUG: Could not determine initial UMN from tree data's defaultSelected flag.");
        contentItems.forEach(item => {
             const container = document.getElementById(item.id);
             if (container) {
                container.innerHTML = `<p class="discover-item-placeholder error" style="display:block;">Error: Could not initialize with default filter from tree.</p>`;
             }
        });
    }
});