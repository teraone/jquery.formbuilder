<li id="{fbid}" class="frmb-group">
  <h4>{label}</h4>
  <label for="{fbid}_label">Label :</label>
  <input type="text" value="{model.label}" placeholder="ex: First Name" name="{fbid}_label" id="{fbid}_label" required>
  <label for="{fbid}_required">Obligatoire ?</label>
  <input type="checkbox" value="1" {?model.required}checked="checked"{/model.required} name="{fbid}_required" id="{fbid}_required">
  {?allowsSelection}
  <label for="{fbid}_selected">Sélectionné ?</label>
  <input type="checkbox" value="1" {?model.selected}checked="checked"{/model.selected} name="{fbid}_selected" id="{fbid}_selected">
  {/allowsSelection}
  <a href="#" class="frmb-remove">Supprimer</a>
  {?allowsChoices}
  <a href="#" class="frmb-add-choice">Ajouter un choix</a>
  <ul class="frmb-choices">
  </ul>
  {/allowsChoices}
</li>