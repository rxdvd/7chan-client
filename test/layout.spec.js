/**
* @jest-environment jsdom
*/

const fs = require('fs');
const { TestWatcher, SearchSource } = require('jest');
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');

describe('index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {
        
        it('has stylesheet', () => {
            let stylesheet = document.querySelector("head link[rel='stylesheet']");
            expect(stylesheet).toBeTruthy();
        });

        it('has favicon', () => {
            let icon = document.querySelector("head link[rel='shortcut icon']");
            expect(icon).toBeTruthy();
        });
        
        it('has "Home - Coderunner" as title', () => {
            let title = document.querySelector("head title");
            expect(title).toBeTruthy();
            expect(title.textContent).toBe('Home - Coderunner');
        });

        it('has a bootstrap script', () => {
            let script = document.querySelector('head script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]');
            expect(script).toBeTruthy();
        }); 

        it('has a bundle script', () => {
            let script = document.querySelector("head script[src='./bundle.js']");
            expect(script).toBeTruthy();
        }); 
        
        it('has a defer property in the (first) script', () => {
            let script = document.querySelector('head script');
            expect(script).toBeTruthy();
            console.log(script.attributes[1].name);
            //expect(script.hasAttributes("defert")).toBeTrue; //it works but to finish off !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            });

    });

    describe('single post modal', () => {

        test('has the heading with h5 tag in modal title', () => {
            let titlePostModal = document.querySelector("body div div div h5");
            expect(titlePostModal).toBeTruthy();
            expect(titlePostModal.textContent).toContain('');
        })

        test('has the time in modal post', () => {
            let timePostModal = document.querySelector("body div div div div div[id='single-post-timestamp']");
            expect(timePostModal).toBeTruthy();
            expect(timePostModal.textContent).toContain('AM' || 'PM');
        })
        test('has paragraph in modal post', () => {
            let paragraphPostModal = document.querySelector("body p[id='single-post-msg']");
            expect(paragraphPostModal).toBeTruthy();
            expect(paragraphPostModal.textContent).toContain('');
        })

        test('has tags in modal post', () => {
            let tagsPostModal = document.querySelector("body div[id='single-post-tags']");
            expect(tagsPostModal).toBeTruthy();
            expect(tagsPostModal.textContent).toContain('');
        })

        test('to have thumbs up emoji in modal post', () => {
            let thumbsUpButtonPostModal = document.querySelector("body button[data-emoji='thumbs_up']");
            expect(thumbsUpButtonPostModal).toBeTruthy();
            expect(thumbsUpButtonPostModal.textContent).toContain('👍');
             
        })

        test('to have thumbs down emoji in modal post', () => {
            let thumbsDownButtonPostModal = document.querySelector("body button[data-emoji='thumbs_down']");
            expect(thumbsDownButtonPostModal).toBeTruthy();
            expect(thumbsDownButtonPostModal.textContent).toContain('👎');
             
        })

        test('to have heart emoji in modal post', () => {
            let heartButtonPostModal = document.querySelector("body button[data-emoji='heart']");
            expect(heartButtonPostModal).toBeTruthy();
            expect(heartButtonPostModal.textContent).toContain('❤');
             
        })

        test('has Comments heading in modal post', () => {
            let commentsHeadingPostModal = document.querySelector("body h5[class='modal-title mb-2']");
            expect(commentsHeadingPostModal).toBeTruthy();
            expect(commentsHeadingPostModal.textContent).toBe('Comments');
        })

        test('has timestamp of a comment in modal post', () => {
            let timestampCommentPostModal = document.querySelector("body span[class='comment-time small text-muted']");
            expect(timestampCommentPostModal).toBeTruthy();
            expect(timestampCommentPostModal.textContent).toContain('AM' || 'PM');
        })

        test('has timestamp of a comment in modal post', () => {
            let commentPostModal = document.querySelector("body p[class='comment-body px-4']");
            expect(commentPostModal).toBeTruthy();
            expect(commentPostModal.textContent).toContain('');
        })

        test('has Post a comment: in modal post', () => {
            let postACommentPostModal = document.querySelector("body form label[for='comment-form-message']");
            expect(postACommentPostModal).toBeTruthy();
            expect(postACommentPostModal.textContent).toBe('Post a comment:');
        })

        test('has X characters remaining in modal post', () => {
            let xCharactersRemainingPostModal = document.querySelector("body form div[class='small text-muted']");
            expect(xCharactersRemainingPostModal).toBeTruthy();
            expect(xCharactersRemainingPostModal.textContent).toContain('characters remaining');
        })
    });

    describe('giphy modal', () => {

        test('has search button in modal Giphy', () => {
            let searchGiphyModal = document.querySelector("body button[id='giph-search-btn']");
            expect(searchGiphyModal).toBeTruthy();
            expect(searchGiphyModal.textContent).toBe(' Search');
        })

        test('has close button in modal Giphy', () => {
            let closeGiphyModal = document.querySelector("body button[id='giph-close-btn']");
            expect(closeGiphyModal).toBeTruthy();
            expect(closeGiphyModal.textContent).toBe('Close');
        })
    });

    describe('info box modal', () => {

        test('has the heading About', () => {
            let infoBoxHeadingAboutMain = document.querySelector("body h3");
            expect(infoBoxHeadingAboutMain).toBeTruthy();
            expect(infoBoxHeadingAboutMain.textContent).toBe('About');
            
        })
            
        test('has the heading What is this site?.', () => {
            let infoBoxHeadingMain = document.querySelector("body  section h5[id='info-modal-heading1']");
            expect(infoBoxHeadingMain).toBeTruthy();
            expect(infoBoxHeadingMain.textContent).toBe('What is this site?');
            
        })
        
        test('has the paragraph This platform is primarily for coders to anonymously share their experiences with other coders around the world.', () => {
            let infoBoxParagraphMain = document.querySelector("body p[id='info-modal-para1']");
            expect(infoBoxParagraphMain).toBeTruthy();
            expect(infoBoxParagraphMain.textContent).toContain('This platform is primarily for coders to anonymously share their experiences with other coders around the world');

        })

        test('has the heading What can I share?', () => {
            let infoBoxHeading2Main = document.querySelector("body section h5[id='info-modal-heading2']");
            expect(infoBoxHeading2Main).toBeTruthy();
            expect(infoBoxHeading2Main.textContent).toBe('What can I share?');
            
        })
        
        test('has the paragraph You can ask questions, share tips or just talk about something relatable that happened to you or someone you know.', () => {
            let infoBoxParagraph2Main = document.querySelector("body p[id='info-modal-para2']");
            expect(infoBoxParagraph2Main).toBeTruthy();
            expect(infoBoxParagraph2Main.textContent).toContain('You can ask questions, share tips or just talk about something relatable that happened to you or someone you know');

        })

        test('has the heading Who made this site?', () => {
            let infoBoxHeading3Main = document.querySelector("body section h5[id='info-modal-heading3']");
            expect(infoBoxHeading3Main).toBeTruthy();
            expect(infoBoxHeading3Main.textContent).toBe('Who made this site?');
            
        })
        
        test('has the paragraph This was a collaborative group project as part of lap 1 of the training course at', () => {
            let infoBoxParagraph3Main = document.querySelector("body p[id='info-modal-para3']");
            expect(infoBoxParagraph3Main).toBeTruthy();
            expect(infoBoxParagraph3Main.textContent).toContain('This was a collaborative group project as part of lap 1 of the training course at');

        })
    });

    describe('nav bar', () => {
        test('has the heading of  </ coderunner>', () => {
            let coderunnerNav = document.querySelector("body nav a");
            expect(coderunnerNav).toBeTruthy();
            expect(coderunnerNav.textContent).toBe('</ coderunner>');

        })

        // test('to see if a button is present', () => {
        //     const { getByTestId } = render(<Text />);
        //     const buttonNav = getByTestId("button-nav");
        //     expect(buttonNav).toBeInTheDocument();

        // })

        test('has the heading of  About', () => {
            let aboutNav = document.querySelector("body nav div div ul li a[href='#about']");
            expect(aboutNav).toBeTruthy();
            expect(aboutNav.textContent).toBe('About');

        })

        test('has the heading of  Github', () => {
            let githubNav = document.querySelector("body nav div div ul li a[href='https://github.com/rxdvd/coderunner-client']");
            expect(githubNav).toBeTruthy();
            expect(githubNav.textContent).toBe('Github');

        })


        
        // test('has a dark background', () => {
        //     const colourBgDark = '#f8f9fa'
        //     let backgroundNav = document.querySelector('body nav[class="navbar-dark bg-dark"]');
            
        //     expect(backgroundNav).stylesheet(`background: ${colourBgDark}`);
        // });

    });

    describe('header', () => {

        test('has the heading Share your coding experience.', () => {
            let headingHeader = document.querySelector("body header h1");
            expect(headingHeader).toBeTruthy();
            expect(headingHeader.textContent).toBe('Share your coding experience.');

        })

        test('has the paragraph Anonymous platform for coders to share their stories.', () => {
            let paragraphHeader = document.querySelector("body header p");
            expect(paragraphHeader).toBeTruthy();
            expect(paragraphHeader.textContent).toContain('Anonymous platform for coders to share their stories.');

        })
    });

    describe('main content ', () => {


        describe('post form', () => {

            test('What\'s on your mind?', () => {
                let formHeadingMain = document.querySelector("body main div div form h2");
                expect(formHeadingMain).toBeTruthy();
                expect(formHeadingMain.textContent).toBe('What\'s on your mind?');
                 
            })

            test('to have Title in form', () => {
                let titleHeadingMain = document.querySelector("body main div div form label");
                expect(titleHeadingMain).toBeTruthy();
                expect(titleHeadingMain.textContent).toBe('Title');
                 
            })

            test('to have Message in form', () => {
                let messageFormMain = document.querySelector("body main div div form label[for='post-form-message']");
                expect(messageFormMain).toBeTruthy();
                expect(messageFormMain.textContent).toBe('Message');
                 
            })

            test('to have Tags (comma separated) in form', () => {
                let tagsFormMain = document.querySelector("body main div div form label[for='post-form-tags']");
                expect(tagsFormMain).toBeTruthy();
                expect(tagsFormMain.textContent).toBe('Tags (comma separated)');
                 
            })

            test('to have Sort by: in form', () => {
                let sortByFormMain = document.querySelector("body main div div form label[for='post-sort-select']");
                expect(sortByFormMain).toBeTruthy();
                expect(sortByFormMain.textContent).toBe('Sort by: ');
                 
            })

            test('to have Search tags (comma separated): in form', () => {
                let searchTagsFormMain = document.querySelector("body main div div form label[for='post-filter']");
                expect(searchTagsFormMain).toBeTruthy();
                expect(searchTagsFormMain.textContent).toBe('Search tags (comma separated):');
                 
            })
        });

        describe('posts', () => {

            test('to have time checked to be AM or PM in post', () => {
                let timeArticleMain = document.querySelector("body main div div article div div[class='small text-muted']");
                expect(timeArticleMain).toBeTruthy();
                expect(timeArticleMain.textContent).toContain('AM' || 'PM');
                 
            })

            test('to have h2 to have text in post', () => {
                let postHeaderArticleMain = document.querySelector("body main div div article h2");
                expect(postHeaderArticleMain).toBeTruthy();
                expect(postHeaderArticleMain.textContent).toContain('');
                 
            })

            test('to have p to have text in post', () => {
                let postMessageArticleMain = document.querySelector("body main div div article p");
                expect(postMessageArticleMain).toBeTruthy();
                expect(postMessageArticleMain.textContent).toContain('');
                 
            })

            test('to have thumbs up emoji in post', () => {
                let thumbsUpArticleMain = document.querySelector("body main div div article button[data-emoji='thumbs_up']");
                expect(thumbsUpArticleMain).toBeTruthy();
                expect(thumbsUpArticleMain.textContent).toContain('👍');
                 
            })

            test('to have thumbs down emoji in post', () => {
                let thumbsDownArticleMain = document.querySelector("body main div div article button[data-emoji='thumbs_down']");
                expect(thumbsDownArticleMain).toBeTruthy();
                expect(thumbsDownArticleMain.textContent).toContain('👎');
                 
            })

            test('to have heart emoji in post', () => {
                let heartArticleMain = document.querySelector("body main div div article button[data-emoji='heart']");
                expect(heartArticleMain).toBeTruthy();
                expect(heartArticleMain.textContent).toContain('❤');
                 
            })

            test('to have comments in post', () => {
                let commentsArticleMain = document.querySelector("body main div div article a[class='btn btn-outline-secondary']");
                expect(commentsArticleMain).toBeTruthy();
                expect(commentsArticleMain.textContent).toContain('Comments');
                 
            })
            
        });

        describe('pagination', () => {

            test('to have prev  in pagination', () => {
                let prevPaginationMain = document.querySelector("body main div div nav ul li a[data-page='0']");
                expect(prevPaginationMain).toBeTruthy();
                expect(prevPaginationMain.textContent).toBe('Prev');
                 
            })

            test('to have 1  in pagination', () => {
                let onePaginationMain = document.querySelector("body main div div nav ul li a[data-page='1']");
                expect(onePaginationMain).toBeTruthy();
                expect(onePaginationMain.textContent).toBe('1');
                 
            })

            test('to have Next  in pagination', () => {
                let nextPaginationMain = document.querySelector("body main div div nav ul li a[id='Next_page']");
                expect(nextPaginationMain).toBeTruthy();
                expect(nextPaginationMain.textContent).toBe('Next');
                 
            })
        });
    });

    describe('footer', () => {

        test('to have two sentences within the footer', () => {
            let paragraphFooter = document.querySelector("body footer p");
            expect(paragraphFooter).toBeTruthy();
            expect(paragraphFooter.textContent).toContain('Published under the ISC License.' && 'Deployed with Netlify and Heroku.');
             
        })
    });
});
