<div class="frmb-form">
  <div>
    <select class="frmb-add-elem" id="frmb-add-elem">
      <option value="">Ajouter un composant</option>
      {#field_types}
      <option value="{key}">{label}</option>
      {/field_types}
    </select>
  </div>
  <ul>
  </ul>
  <!-- <button type="submit" class="frmb-save">Save</button> -->
</div>