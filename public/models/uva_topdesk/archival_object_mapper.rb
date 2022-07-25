module UvaTopdesk
  class ArchivalObjectMapper < ItemMapper

    RequestList.register_item_mapper(self, :uva_topdesk, ArchivalObject)

    def map_extensions(mapped, item, repository, resource, resource_json)
      super
      mapped.ext(:level).name = item['level'].capitalize
    end


    def form_fields(mapped)
      shared_fields = {
        'resource_title'               => mapped.collection.name,
        'resource_id'                  => mapped.collection.id,
        'resource_uri'                 => mapped.collection.uri,

        'ao_title'                     => mapped.record.name,
        'ao_id'                        => mapped.record.id,
        'ao_uri'                       => mapped.record.uri,

        'creator'                      => mapped.creator.name,
        'date'                         => mapped.date.name,
        'location'                     => mapped.ext(:location).name,
        'physical_location'            => mapped.ext(:physical_location).name,
        'access_restrictions'          => mapped.record.ext(:access_restrictions),
        'resource_access_restrictions' => mapped.collection.ext(:access_restrictions),
      }

      return [as_topdesk_request(shared_fields)] unless mapped.container.has_multi?

      mapped.container.multi.map {|c|
        as_topdesk_request(with_mapped_container(mapped, shared_fields, c))
      }
    end

  end
end
