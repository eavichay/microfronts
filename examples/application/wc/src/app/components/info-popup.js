import { tag, template, useShadow } from "slim-js/Decorators";

@tag('info-popup')
@useShadow(true)
@template(/*html*/`
${require('./info-popup.style.html')}
<h3>Comparison</h3>
  <p>Slim.js has just the right balance between being feature-rich and lightweight. It has a small learning-curve, high performance, less memory footprint and supported by all evergreen browsers.</p>
  <table id="comparison">
    <thead>
      <td>Library</td>
      <td>Performance</td>
      <td>Data Binding</td>
      <td>Code style</td>
      <td>Tools</td>
      <td>Size (GZipped)</td>
    </thead>
    <tbody>
      <tr>
        <td>Slim.js</td>
        <td class="rating">⭐⭐⭐⭐⭐</td>
        <td class="data-binding-info">✅ Built-in</td>
        <td>
          <ul>
            <li>Declarative</li>
            <li>Typescript / Javascript</li>
          </ul>
        </td>
        <td>Optional 👍</td>
        <td>4.5K</td>
      </tr>
      <tr>
        <td>Polymer</td>
        <td class="rating">⭐⭐</td>
        <td class="data-binding-info">✅ Built-in</td>
        <td>
          <ul>
            <li>Declarative</li>
            <li>Explicit</li>
            <li>Javascript</li>
          </ul>
        </td>
        <td>
          <ul>
            <li>Polymer-cli</li>
            <li>Polymer-server</li>
          </ul>
        </td>
        <td>100K</td>
      </tr>
      <tr>
        <td>x-tag</td>
        <td class="rating">⭐⭐⭐⭐</td>
        <td class="data-binding-info">N/A</td>
        <td>Imperative</td>
        <td>None 👍</td>
        <td>6.5K</td>
      </tr>
      <tr>
        <td>skateJs</td>
        <td class="rating">⭐⭐⭐⭐</td>
        <td class="data-binding-info">Unidirectional JSX + preact</td>
        <td>
          <ul>
            <li>JSX</li>
            <li>Requires renderer</li>
          </ul>
        </td>
        <td>Requires Babel/JSX</td>
        <td>7.1K (with renderer)</td>
      </tr>
      <tr>
        <td>Stencil</td>
        <td class="rating">⭐⭐⭐</td>
        <td class="data-binding-info">Unidirectional TSX + Virtual DOM</td>
        <td>
          <ul>
            <li>TSX</li>
            <li>Typescript only</li>
          </ul>
        </td>
        <td>Stencil compiler</td>
        <td>N/A</td>
      </tr>
    </tbody>
  </table>
`)
class InfoPopup extends Slim {}