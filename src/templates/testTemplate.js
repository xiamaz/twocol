import React from "react"
import { graphql } from "gatsby"
export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="blog-post-container">
      <link rel="stylesheet" href="style.css"/>
      <div className="blog-post">
        <div className="ldeco"></div>
        <div className="rdeco"></div>
        <div className="blog-post-title">
          <h1>{frontmatter.title}</h1>
          <p>{frontmatter.date}</p>
        </div>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
