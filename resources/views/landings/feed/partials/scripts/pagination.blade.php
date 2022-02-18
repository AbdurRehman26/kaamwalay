<script>
            // Create the render function
            const renderPagination = (renderOptions, isFirstRender) => {
            const {
                pages,
                currentRefinement,
                nbPages,
                isFirstPage,
                isLastPage,
                refine,
                createURL,
            } = renderOptions;

            const container = document.querySelector('.feed-pagintion-section__pagination');

            container.innerHTML = `
                ${
                    !isFirstPage
                    ? `
                        <p>
                        <a
                            href="${createURL(currentRefinement - 1)}"
                            data-value="${currentRefinement - 1}"
                        >  <
                        </a>
                        </p>
                        `
                    : '<p>  < </p>'
                }
                    ${
                    !isLastPage
                        ? `
                        <p class="ml-4">
                            <a
                            href="${createURL(currentRefinement + 1)}"
                            data-value="${currentRefinement + 1}"
                            >
                            >
                            </a>
                        </p>
                        `
                        : '<p class="ml-4"> > </p>'
                    }
            `;

            [...container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
                });
            });
            };

            // Create the custom widget
            const customPagination = instantsearch.connectors.connectPagination(
            renderPagination
            );

            // Instantiate the custom widget
            search.addWidgets([
            customPagination({
                container: document.querySelector('.pagination'),
            })
            ]);
</script>
