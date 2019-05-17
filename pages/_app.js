import App, {Container} from "next/app";
import "../sass/global.sass";
import Head from 'next/head';

export default class extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
        <Container>
            <Head>
                <title>Andres Sweeney-Rios</title>
                <link href="https://fonts.googleapis.com/css?family=Questrial" rel="stylesheet" />
                <meta name="theme-color" content="#272727"></meta> 
            </Head>
            <Component {...pageProps} />
        </Container>
    )
  }
}