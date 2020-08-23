import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

export default class MyApp extends App {
  public render () {
    const { Component } = this.props

    return (
      <Container>
        <Head>
          <title>Dispatch</title>
        </Head>
        <Component />
      </Container>
    )
  }
}
