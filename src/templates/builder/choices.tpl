<li id="{fbid}" class="frmb-choice-group">
  <label for="{fbid}.label">Label du choix :</label>
  <input type="text" value="{model.label}" placeholder="ex: Red" name="{fbid}.label" id="{fbid}.label" required>
  <label for="{fbid}.selected">Sélectionné ?</label>
  <input type="checkbox" value="1" {?model.selected}checked="checked"{/model.selected} name="{fbid}.selected" id="{fbid}.selected">
  <a href="#" class="frmb-choice-remove">Supprimer</a>
</li>