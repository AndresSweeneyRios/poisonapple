import Link from 'next/link'
import css from './index.sass'
import Projects from '../../projects.js'

export default class extends React.Component {
    componentDidMount () {
        const elements = document.querySelectorAll(`.${css.screenshots}`)
        
        for (const screenshots of elements) 
            screenshots.scrollInterval = setInterval( 
                () => this.scrollScreenshots(screenshots),
                16.66
            )
    }

    scrollScreenshots (screenshots) {
        let { scrollTop, scrollHeight, offsetHeight } = screenshots

        scrollTop++

        if ( scrollTop === (scrollHeight - offsetHeight)/2 + offsetHeight/2 ) 
            scrollTop = 0

        screenshots.scrollTop = scrollTop
    }

    getProjects () {
        const projects = []

        for (const project of Projects) {
            const screenshots = [], links = []

            for (const screenshot of project.screenshots)
                screenshots.push(
                    <div key={ screenshot } className={ css.screenshot } style={{
                        backgroundImage: `url(/static/projects/${project.id}/screenshots/${screenshot}.png)`
                    }} />
                )

            for (const screenshot of project.screenshots)
                screenshots.push(
                    <div key={ screenshot + '0' } className={ css.screenshot } style={{
                        backgroundImage: `url(/static/projects/${project.id}/screenshots/${screenshot}.png)`
                    }} />
                )


            for (const link of project.links)
                links.push(
                    <a 
                        key={ link.url } 
                        type={ link.type } 
                        target="_blank" 
                        className={ css.link } 
                        href={ link.url } 
                        style={{
                            backgroundImage: `url(/static/icons/${link.type}_circle.svg)`
                        }} 
                    />
                )

            projects.push(
                <div 
                    key={ project.id } 
                    className={ `${css.project}` } 
                    style={{
                        backgroundImage: `url(/static/projects/${project.id}/${project.id}.png)`
                    }}
                >
                    <div>
                        <div className={ css.info }>
                            <div>
                                <h2 className={ css.title }>{ project.title }</h2>
                                { links }
                            </div>

                            <p className={ css.description }>{ project.description }</p>
                        </div>

                        <div className={ css.screenshots }>
                            <div>
                                { screenshots }
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return projects
    }

    render () {
        return (
            <div className={ css.projects }>
                { this.getProjects() }
            </div>
        )
    }
}