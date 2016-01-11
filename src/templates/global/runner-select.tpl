<li>
  <label for="{id}">{label}</label>
  <select name="{id}" id="{id}"{?required} required{/required}>
  	<!-- add an empty selected option when required to force user choice -->
  	{?required}<option disabled="disabled" selected="selected" value>-</option>{/required}
  </select>
</li>