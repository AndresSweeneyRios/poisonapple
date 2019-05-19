import { withRouter } from 'next/router'
import css from './index.sass'
import Projects from '../../../projects.js'

export default withRouter( class extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            index: 0
        }
    }

    selectIndex (index) {
        this.setState({
            index
        })

        const selection = document.querySelector(`.${ css.selector }`)

        if (selection) selection.scrollLeft = selection.children[index].offsetLeft - 60
    }

    render () {
        if (
            this.props.router.query.id && 
            Projects[this.props.router.query.id] &&
            Projects[this.props.router.query.id].screenshots
        ) return (
            <div className={ css.gallery }>
                <div className={ css.selector }>
                    { 
                        Projects[this.props.router.query.id].screenshots.map(
                            screenshot => 
                                <img 
                                    key={ screenshot }
                                    index={ screenshot }
                                    className={ css.screenshot }

                                    src={ 
                                        `/static/projects/${
                                            this.props.router.query.id
                                        }/screenshots/${screenshot}.png` 
                                    } 

                                    onClick={ () => this.selectIndex(
                                        screenshot - 1
                                    ) } 
                                />
                        )
                    }
                </div>
                
                <div className={ css.viewport }>
                    <div 
                        style={{
                            backgroundImage: `url(/static/projects/${
                                this.props.router.query.id
                            }/screenshots/${
                                Projects[this.props.router.query.id].screenshots[this.state.index]
                            }.png)` 
                        }}
                    />

                    <img 
                        src={ 
                            `/static/projects/${
                                this.props.router.query.id
                            }/screenshots/${
                                Projects[this.props.router.query.id].screenshots[this.state.index]
                            }.png` 
                        }
                    />
                </div>
            </div>
        )

        else return (
            <h2>
                Invalid project ID.
            </h2>
        )
    }
})