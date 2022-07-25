module UvaTopdesk
  class ContainerMapper < ItemMapper

    RequestList.register_item_mapper(self, :uva_topdesk, Container)

    def request_permitted?(item)
      # only if only one resource
      item['json']['collection'].length < 2
    end


    def form_fields(mapped)
      [as_topdesk_request(with_mapped_container(mapped, {
        'resource_title'               => mapped.collection.name,
        'resource_id'                  => mapped.collection.id,
        'resource_uri'                 => mapped.collection.uri,

        'creator'                      => mapped.creator.name,
        'date'                         => mapped.date.name,
        'location'                     => mapped.ext(:location).name,
        'physical_location'            => mapped.ext(:physical_location).name,
        'resource_access_restrictions' => mapped.collection.ext(:access_restrictions),
      }, mapped.container.multi.first))]
    end

  end
end
