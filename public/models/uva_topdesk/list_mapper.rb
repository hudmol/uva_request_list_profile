module UvaTopdesk
  class ListMapper < RequestListMapper

    RequestList.register_list_mapper(self, :uva_topdesk)

    def form_fields
      {
      }
    end

  end
end
